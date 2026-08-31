import { msg } from "@/lib/i18n/config";

export type CategoryValue = "machines" | "beans" | "accessories" | "ingredients";
export type SubcategoryValue =
  | "1-group"
  | "2-group"
  | "grinder"
  | "blender"
  | "roasted"
  | "green";

export interface Subcategory {
  value: SubcategoryValue;
  label: string;
  title: string;
  description?: string;
}

export interface Category {
  value: CategoryValue;
  label: string;
  title: string;
  description?: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    value: "machines",
    label: msg("Machines"),
    title: msg("Coffee Machines"),
    description:
      msg("Coffee machines and accessories for every taste and budget — for your home, office, and commercial use."),
    subcategories: [
      { value: "1-group", label: msg("1-Group Machine"), title: msg("1-Group Machines") },
      { value: "2-group", label: msg("2-Group Machine"), title: msg("2-Group Machines") },
      { value: "grinder", label: msg("Grinder"), title: msg("Grinders") },
      { value: "blender", label: msg("Blender"), title: msg("Blenders") },
    ],
  },
  {
    value: "beans",
    label: msg("Beans"),
    title: msg("Coffee Beans"),
    description:
      msg("Sourcing quality beans for the perfect signature taste. We source quality green beans from across Cambodia and the globe, roasting them in-house for true Robusta and Arabica greatness."),
    subcategories: [
      { value: "roasted", label: msg("Roasted Beans"), title: msg("Roasted Beans") },
      { value: "green", label: msg("Green Beans"), title: msg("Green Beans") },
    ],
  },
  {
    value: "accessories",
    label: msg("Accessories"),
    title: msg("Accessories"),
    subcategories: [],
  },
  {
    value: "ingredients",
    label: msg("Ingredients"),
    title: msg("Ingredients"),
    subcategories: [],
  },
];

export function getCategory(value: string): Category | undefined {
  return CATEGORIES.find((c) => c.value === value);
}

export function getSubcategories(value: string): Subcategory[] {
  return getCategory(value)?.subcategories ?? [];
}

export function getSubcategory(
  categoryValue: string,
  subcategoryValue: string,
): Subcategory | undefined {
  return getSubcategories(categoryValue).find(
    (s) => s.value === subcategoryValue,
  );
}

export function catalogView(
  category: CategoryValue,
  subcategory?: SubcategoryValue | null,
): string {
  return subcategory ? `${category}/${subcategory}` : category;
}

export function parseCatalogView(
  view: string,
): { category: CategoryValue; subcategory?: SubcategoryValue } | null {
  const [categoryPart, subcategoryPart] = view.split("/");
  const category = getCategory(categoryPart);
  if (!category) return null;

  if (!subcategoryPart) {
    return { category: category.value };
  }

  const subcategory = getSubcategory(category.value, subcategoryPart);
  if (!subcategory) return null;

  return { category: category.value, subcategory: subcategory.value };
}
