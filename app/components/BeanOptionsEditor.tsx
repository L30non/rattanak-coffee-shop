import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { GRIND_OPTIONS, type GrindType, type WeightOption } from "@/lib/beans";

interface BeanOptionsEditorProps {
  /** Keeps input ids unique when both dialogs are mounted ("add" / "edit"). */
  idPrefix: string;
  weightOptions: WeightOption[];
  grindOptions: GrindType[];
  onChange: (next: {
    weight_options: WeightOption[];
    grind_options: GrindType[];
  }) => void;
}

/** Price is held as text while typing so "8." and "" stay editable. */
interface WeightRow {
  label: string;
  price: string;
}

function toRows(options: WeightOption[]): WeightRow[] {
  return options.map((o) => ({ label: o.label, price: String(o.price) }));
}

function toOptions(rows: WeightRow[]): WeightOption[] {
  return rows
    .filter((r) => r.label.trim().length > 0)
    .map((r) => ({
      label: r.label.trim(),
      price: Number.parseFloat(r.price) || 0,
    }));
}

/**
 * Admin editor for the bean-only purchase options: which grinds are offered and
 * what each weight costs. Mount with a `key` tied to the product so the draft
 * rows reset when a different product is opened.
 */
export function BeanOptionsEditor({
  idPrefix,
  weightOptions,
  grindOptions,
  onChange,
}: BeanOptionsEditorProps) {
  const [rows, setRows] = useState<WeightRow[]>(() => toRows(weightOptions));

  const commit = (nextRows: WeightRow[], nextGrinds: GrindType[]) => {
    setRows(nextRows);
    onChange({
      weight_options: toOptions(nextRows),
      grind_options: nextGrinds,
    });
  };

  const updateRow = (index: number, patch: Partial<WeightRow>) => {
    commit(
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
      grindOptions,
    );
  };

  const addRow = () => commit([...rows, { label: "", price: "" }], grindOptions);

  const removeRow = (index: number) =>
    commit(
      rows.filter((_, i) => i !== index),
      grindOptions,
    );

  const toggleGrind = (grind: GrindType, checked: boolean) => {
    const next = checked
      ? [...grindOptions, grind]
      : grindOptions.filter((g) => g !== grind);
    // Keep a stable order so the storefront pre-selects predictably.
    commit(
      rows,
      GRIND_OPTIONS.map((g) => g.value).filter((g) => next.includes(g)),
    );
  };

  return (
    <div className="space-y-4 rounded-md border border-dashed p-4">
      <div>
        <Label className="text-sm font-semibold">Bean Options</Label>
        <p className="text-xs text-gray-500 mt-1">
          Only used for products in the Beans category.
        </p>
      </div>

      <div>
        <Label className="text-sm">Grind Types Offered</Label>
        <div className="mt-2 space-y-2">
          {GRIND_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                id={`${idPrefix}-grind-${option.value}`}
                checked={grindOptions.includes(option.value)}
                onCheckedChange={(checked) =>
                  toggleGrind(option.value, checked === true)
                }
              />
              <Label
                htmlFor={`${idPrefix}-grind-${option.value}`}
                className="text-sm font-normal"
              >
                {option.label}
                <span className="text-gray-500"> — {option.description}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm">Weights &amp; Prices</Label>
        <p className="text-xs text-gray-500 mt-1 mb-2">
          The first weight is pre-selected on the product page. Leave empty to
          sell at the flat price above.
        </p>
        <div className="space-y-2">
          {rows.map((row, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                id={`${idPrefix}-weight-label-${index}`}
                placeholder="250g"
                value={row.label}
                onChange={(e) => updateRow(index, { label: e.target.value })}
                className="flex-1"
              />
              <div className="relative w-32">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  $
                </span>
                <Input
                  id={`${idPrefix}-weight-price-${index}`}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={row.price}
                  onChange={(e) => updateRow(index, { price: e.target.value })}
                  className="pl-6"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(index)}
                aria-label={`Remove weight option ${index + 1}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Weight
        </Button>
      </div>
    </div>
  );
}
