/**
 * Bean-specific product options: grind type (whole bean vs ground powder) and
 * admin-priced weight options. Only products in the "beans" category use these.
 *
 * This module deliberately has no imports so `useStore` can depend on it without
 * a cycle — helpers take the structural shape they need instead of `Product`.
 */

export type GrindType = "whole" | "ground";

export interface GrindOption {
  value: GrindType;
  label: string;
  description: string;
}

export const GRIND_OPTIONS: GrindOption[] = [
  {
    value: "whole",
    label: "Coffee Beans",
    description: "Whole beans — grind fresh at home",
  },
  {
    value: "ground",
    label: "Ground Coffee",
    description: "Pre-ground powder — ready to brew",
  },
];

/** A weight the admin sells this product in, with its own price. */
export interface WeightOption {
  label: string;
  price: number;
}

/** Minimal product shape the bean helpers need. */
export interface BeanConfigurable {
  category: string;
  price: number;
  weight: string | null;
  weight_options?: WeightOption[] | null;
  grind_options?: GrindType[] | null;
}

export function isBeanProduct(product: { category: string }): boolean {
  return product.category === "beans";
}

export function getGrindLabel(grind: GrindType): string {
  return GRIND_OPTIONS.find((g) => g.value === grind)?.label ?? grind;
}

/** Grind choices offered for a product — empty for non-beans or unconfigured. */
export function getGrindOptions(product: BeanConfigurable): GrindOption[] {
  if (!isBeanProduct(product)) return [];
  const enabled = product.grind_options ?? [];
  return GRIND_OPTIONS.filter((g) => enabled.includes(g.value));
}

/**
 * Weight choices offered for a product. Falls back to the legacy single
 * `weight` field at the base price so products predating weight pricing still
 * render a (single) sensible option.
 */
export function getWeightOptions(product: BeanConfigurable): WeightOption[] {
  if (!isBeanProduct(product)) return [];
  const options = (product.weight_options ?? []).filter(
    (o) => o && o.label.trim().length > 0,
  );
  if (options.length > 0) return options;
  return product.weight ? [{ label: product.weight, price: product.price }] : [];
}

/** True when the customer has something to choose before adding to cart. */
export function hasBeanOptions(product: BeanConfigurable): boolean {
  return getWeightOptions(product).length > 0 || getGrindOptions(product).length > 0;
}

/**
 * True when a choice is genuinely open — more than one weight or grind. A
 * single option each is unambiguous, so listings can still quick-add those.
 */
export function needsSelection(product: BeanConfigurable): boolean {
  return getWeightOptions(product).length > 1 || getGrindOptions(product).length > 1;
}

/** The variant selection carried on a cart item. */
export interface CartVariant {
  grind?: GrindType;
  weightLabel?: string;
}

/** Price for a given selection, falling back to the product's base price. */
export function resolveUnitPrice(
  product: BeanConfigurable,
  variant?: CartVariant,
): number {
  if (!variant?.weightLabel) return product.price;
  const match = getWeightOptions(product).find(
    (o) => o.label === variant.weightLabel,
  );
  return match ? match.price : product.price;
}

/** The pre-selected variant: first weight and first grind the admin configured. */
export function defaultVariant(
  product: BeanConfigurable,
): CartVariant | undefined {
  if (!isBeanProduct(product)) return undefined;
  const weights = getWeightOptions(product);
  const grinds = getGrindOptions(product);
  if (weights.length === 0 && grinds.length === 0) return undefined;
  return {
    weightLabel: weights[0]?.label,
    grind: grinds[0]?.value,
  };
}

/** Human-readable summary, e.g. "250g · Ground Coffee". Empty when no variant. */
export function formatVariant(variant?: CartVariant): string {
  if (!variant) return "";
  return [variant.weightLabel, variant.grind && getGrindLabel(variant.grind)]
    .filter(Boolean)
    .join(" · ");
}

/** Lowest price across weight options — for "from $X" listings. */
export function lowestPrice(product: BeanConfigurable): number {
  const options = getWeightOptions(product);
  if (options.length === 0) return product.price;
  return Math.min(...options.map((o) => o.price));
}
