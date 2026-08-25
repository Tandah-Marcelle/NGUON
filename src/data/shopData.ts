// Shop types + category cache — Nguon 2026 mini-marketplace.
// Product/category/order data is fetched live from the backend (see src/lib/api.ts);
// this file only holds shared types and a small fetch-once cache for categories.

import { api } from "@/lib/api";

export type ProductMedia = {
  id?: number;   // present for existing media loaded from the backend; absent for new uploads
  type: "image" | "video";
  url: string;
  alt?: string;
  presignedUrl?: string;
  displayOrder?: number;
};

// Category is an admin-editable string key (see ShopCategory below), not a fixed
// union — matches the backend, where ShopProduct.category is a plain string with
// no FK to ShopCategory (deleting a category leaves existing products untouched).
export type ProductCategory = string;

export type Product = {
  id: number;
  category: ProductCategory;
  name: string;
  tagline: string;
  description: string;
  price: number;          // FCFA
  comparePrice?: number;  // original price if on sale
  unit?: string;          // "pièce", "kg", "lot de 3"...
  inStock: boolean;
  stockQty?: number;
  seller: string;         // artisan / vendor name
  sellerLocation: string;
  phone?: string;
  whatsapp?: string;
  media: ProductMedia[];
  tags: string[];
  featured?: boolean;
  badge?: string;         // "Nouveau", "Promo", "Exclusif Nguon"
  published: boolean;     // visible on the storefront — admin can hide without deleting
};

export type ShopCategory = {
  id: number;
  key: string;
  label: string;
  icon: string;
  description?: string;
  displayOrder?: number;
};

// ─── Category cache ─────────────────────────────────────────────────────────────
// Fetch-once, module-level cache — same "plain async helper" idiom the rest of the
// app already uses (no react-query/hook-with-loading-state needed for this).
let categoriesCache: ShopCategory[] | null = null;
let categoriesPromise: Promise<ShopCategory[]> | null = null;

export async function loadShopCategories(): Promise<ShopCategory[]> {
  if (categoriesCache) return categoriesCache;
  if (!categoriesPromise) {
    categoriesPromise = api.getShopCategories().then((c: ShopCategory[]) => {
      categoriesCache = c;
      return c;
    });
  }
  return categoriesPromise;
}

// Defensive fallbacks: a product may reference a category key that was since
// deleted, or these may be called before loadShopCategories() has resolved.
export function labelOf(key: string): string {
  return categoriesCache?.find((c) => c.key === key)?.label ?? key;
}

export function iconOf(key: string): string {
  return categoriesCache?.find((c) => c.key === key)?.icon ?? "tag";
}
