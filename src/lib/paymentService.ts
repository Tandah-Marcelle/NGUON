/**
 * paymentService.ts
 *
 * Live payment integration for Nguon 2026 Boutique via CamPay (MTN Mobile Money /
 * Orange Money) — https://www.campay.net. The actual collect/status calls happen
 * server-side (see CamPayController in the backend); this module just calls our
 * own API and exposes a small two-step flow so the UI can show the USSD
 * confirmation hint before waiting for the customer to confirm on their phone.
 */

import { api } from "@/lib/api";

export type PaymentMethod = "mobile_money" | "orange_money";

export type PaymentStatus =
  | "idle"          // not yet initiated
  | "pending"       // collect request sent, awaiting the customer's phone confirmation
  | "paid"          // payment confirmed
  | "failed";       // payment failed, was cancelled, or timed out

export interface CollectRequest {
  orderId: string;         // our own tracking id (sent to CamPay as external_reference)
  amount: number;          // FCFA
  customerPhone: string;   // mobile money number to charge
  description: string;
}

export interface CollectResult {
  success: boolean;
  reference?: string;   // CamPay transaction reference — pass to pollPaymentStatus
  ussdCode?: string;     // e.g. "*126#" — show to the customer while they confirm
  operator?: string;     // MTN or ORANGE, as detected from the phone number
  message?: string;      // present when success = false
}

export interface PaymentResult {
  status: PaymentStatus;
  message?: string;
}

/** Step 1 — sends the collect request; CamPay then prompts the customer's phone. */
export async function initiateCollect(req: CollectRequest): Promise<CollectResult> {
  try {
    const res = await api.campayCollect({
      amount: Math.round(req.amount),
      phone: req.customerPhone,
      description: req.description,
      externalReference: req.orderId,
    });
    return res;
  } catch {
    return { success: false, message: "Impossible de contacter le service de paiement. Réessayez." };
  }
}

/** Step 2 — polls until the customer confirms (or declines/times out) on their phone. */
export async function pollPaymentStatus(
  reference: string,
  { intervalMs = 3000, timeoutMs = 120000 }: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<PaymentResult> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, intervalMs));
    try {
      const res = await api.campayStatus(reference);
      if (res.status === "SUCCESSFUL") return { status: "paid" };
      if (res.status === "FAILED") return { status: "failed", message: res.message ?? "Le paiement a échoué ou a été annulé." };
      // else PENDING — keep polling
    } catch {
      // transient network hiccup — keep polling until the deadline
    }
  }
  return { status: "failed", message: "Délai d'attente dépassé. Vérifiez votre téléphone ou réessayez." };
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mobile_money: "MTN Mobile Money",
  orange_money: "Orange Money",
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, string> = {
  mobile_money: "📱",
  orange_money: "🟠",
};
