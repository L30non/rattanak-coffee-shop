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
    label: "Machines",
    title: "Coffee Machines",
    description:
      "Coffee machines and accessories for every taste and budget — for your home, office, and commercial use.",
    subcategories: [
      { value: "1-group", label: "1-Group Machine", title: "1-Group Machines" },
      { value: "2-group", label: "2-Group Machine", title: "2-Group Machines" },
      { value: "grinder", label: "Grinder", title: "Grinders" },
      { value: "blender", label: "Blender", title: "Blenders" },
    ],
  },
  {
    value: "beans",
    label: "Beans",
    title: "Coffee Beans",
    description:
      "Sourcing quality beans for the perfect signature taste. We source quality green beans from across Cambodia and the globe, roasting them in-house for true Robusta and Arabica greatness.",
    subcategories: [
      { value: "roasted", label: "Roasted Beans", title: "Roasted Beans" },
      { value: "green", label: "Green Beans", title: "Green Beans" },
    ],
  },
  {
    value: "accessories",
    label: "Accessories",
    title: "Accessories",
    subcategories: [],
  },
  {
    value: "ingredients",
    label: "Ingredients",
    title: "Ingredients",
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
