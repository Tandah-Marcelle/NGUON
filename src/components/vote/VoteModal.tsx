import { useState } from "react";
import { motion } from "framer-motion";
import { X, Check, AlertCircle, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { displayName } from "@/lib/voteText";
import { getDeviceId } from "@/lib/deviceId";

// ── Vote modal — email → OTP → success ────────────────────────────────────────
export type VoteProfile = {
  id: number; name: string; description?: string;
  photoUrl: string; photoPresignedUrl?: string; voteCount: number;
};

// A literal dashed/dotted circle, spinning — the loading indicator requested
// for the send/verify steps (distinct from the site's usual arc spinner).
export const DottedSpinner = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <div
    className={`rounded-full border-2 border-dashed border-current animate-spin ${className}`}
    style={{ width: size, height: size }}
  />
);

const OTP_LENGTH = 6;

// Six individual boxes instead of one text field — filters to alphanumeric,
// auto-advances focus, supports paste, and fires onComplete the instant the
// last box is filled (no separate submit click needed).
function OtpBoxInput({
  value, onChange, onComplete, disabled,
}: { value: string; onChange: (v: string) => void; onComplete: (v: string) => void; disabled?: boolean }) {
  const chars = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);
  const refs = useState(() => Array.from({ length: OTP_LENGTH }, () => null as HTMLInputElement | null))[0];

  const setChar = (i: number, raw: string) => {
    const clean = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (!clean) {
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next);
      return;
    }
    const next = (value.slice(0, i) + clean[0] + value.slice(i + 1)).slice(0, OTP_LENGTH);
    onChange(next);
    if (clean[0] && i < OTP_LENGTH - 1) refs[i + 1]?.focus();
    if (next.length === OTP_LENGTH && !next.includes(" ")) onComplete(next);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    onChange(pasted);
    const last = Math.min(pasted.length, OTP_LENGTH) - 1;
    refs[last]?.focus();
    if (pasted.length === OTP_LENGTH) onComplete(pasted);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !chars[i].trim() && i > 0) refs[i - 1]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={el => { refs[i] = el; }}
          value={c.trim()}
          onChange={e => setChar(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          maxLength={1}
          inputMode="text"
          autoFocus={i === 0}
          className="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-black uppercase border-2 border-input rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-50"
        />
      ))}
    </div>
  );
}

export function VoteModal({ profile, onClose, onVoted }: { profile: VoteProfile; onClose: () => void; onVoted: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.requestVoteOtp({ voteProfileId: profile.id, email, deviceId: getDeviceId() });
      if (res.success) {
        setStep("otp");
      } else {
        setError(res.message ?? t("vote.error_generic"));
      }
    } catch {
      setError(t("vote.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.confirmVoteOtp({ email, otp: code, deviceId: getDeviceId() });
      if (res.success) {
        setStep("success");
        onVoted();
      } else {
        setError(res.message ?? t("vote.error_generic"));
      }
    } catch {
      setError(t("vote.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-sm p-7 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <X size={16} />
        </button>

        {step !== "success" && (
          <div className="flex items-center gap-3 mb-5 pr-8">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
              <img src={profile.photoPresignedUrl ?? profile.photoUrl} alt={displayName(profile.name)} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-display font-black text-foreground leading-tight">{displayName(profile.name)}</p>
              <p className="text-xs text-muted-foreground">{t("vote.modal_subtitle")}</p>
            </div>
          </div>
        )}

        {step === "email" && (
          <form onSubmit={submitEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-foreground/60 uppercase tracking-wider mb-1.5">{t("vote.email_label")}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t("vote.email_placeholder")} autoFocus disabled={loading}
                  className="w-full border border-input rounded-xl pl-10 pr-4 py-3 text-base sm:text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition disabled:opacity-50"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">{t("vote.email_hint")}</p>
              <p className="text-xs text-muted-foreground mt-1.5">
                {t("vote.legal_prefix")}{" "}
                <a href="/conditions" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-primary">{t("vote.legal_terms")}</a>
                {" "}{t("vote.legal_and")}{" "}
                <a href="/confidentialite" target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-primary">{t("vote.legal_privacy")}</a>.
              </p>
            </div>
            {error && (
              <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-3 py-2.5 text-xs font-semibold">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-black py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50">
              {loading ? <><DottedSpinner /> {t("vote.sending")}</> : t("vote.send_code")}
            </button>
          </form>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-foreground/60 uppercase tracking-wider mb-3 text-center">{t("vote.otp_label")}</label>
              <OtpBoxInput value={otp} onChange={setOtp} onComplete={submitOtp} disabled={loading} />
              <p className="text-xs text-muted-foreground mt-3 text-center">{t("vote.otp_hint", { email })}</p>
            </div>
            {loading && (
              <div className="flex items-center justify-center gap-2 text-primary text-sm font-semibold">
                <DottedSpinner /> {t("vote.verifying")}
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-3 py-2.5 text-xs font-semibold">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}
            <button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }} disabled={loading} className="w-full text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50">
              {t("vote.change_email")}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-3">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-green-600" />
            </div>
            <h3 className="font-display text-lg font-black text-foreground mb-1.5">{t("vote.success_title")}</h3>
            <p className="text-sm text-muted-foreground mb-5">{t("vote.success_desc", { name: displayName(profile.name) })}</p>
            <button onClick={onClose} className="w-full bg-primary text-white font-black py-3 rounded-xl hover:bg-primary/90 transition-all">
              {t("vote.close")}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Image lightbox — click a candidate photo to enlarge; close via the X
// button or by clicking anywhere outside the image ─────────────────────────
export function VoteImageLightbox({ profile, onClose }: { profile: VoteProfile; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
        <X size={20} />
      </button>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
        className="max-w-lg w-full"
      >
        <img
          src={profile.photoPresignedUrl ?? profile.photoUrl} alt={displayName(profile.name)}
          className="w-full max-h-[75vh] object-contain rounded-2xl"
        />
        <p className="text-center text-white font-display font-black text-lg mt-4">{displayName(profile.name)}</p>
        {profile.description && <p className="text-center text-white/60 text-sm mt-1 max-w-md mx-auto">{profile.description}</p>}
      </motion.div>
    </motion.div>
  );
}
