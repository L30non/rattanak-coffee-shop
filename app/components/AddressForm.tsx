"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Address, useStore } from "@/app/store/useStore";
import { toast } from "sonner";

interface AddressFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  onSuccess?: () => void;
}

export function AddressForm({
  open,
  onOpenChange,
  address,
  onSuccess,
}: AddressFormProps) {
  const { addAddress, updateAddress } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    street_line_1: "",
    street_line_2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "USA",
    phone: "",
    is_default: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        label: address.label || "",
        street_line_1: address.street_line_1,
        street_line_2: address.street_line_2 || "",
        city: address.city,
        state: address.state || "",
        zip_code: address.zip_code,
        country: address.country,
        phone: address.phone || "",
        is_default: address.is_default,
      });
    } else {
      setFormData({
        label: "",
        street_line_1: "",
        street_line_2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "USA",
        phone: "",
        is_default: false,
      });
    }
  }, [address, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.street_line_1.trim()) {
      toast.error("Street address is required");
      return;
    }
    if (!formData.city.trim()) {
      toast.error("City is required");
      return;
    }
    if (!formData.zip_code.trim()) {
      toast.error("ZIP code is required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (address) {
        // Update existing address
        const response = await fetch(`/api/addresses/${address.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          updateAddress(address.id, data.address);
          toast.success("Address updated successfully");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error("Failed to update address");
        }
      } else {
        // Create new address
        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          addAddress(data.address);
          toast.success("Address added successfully");
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error("Failed to add address");
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {address ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {address
                ? "Update your shipping address details."
                : "Add a new shipping address for faster checkout."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Label */}
            <div className="grid gap-2">
              <Label htmlFor="label">
                Label <span className="text-gray-500 text-sm">(optional)</span>
              </Label>
              <Input
                id="label"
                placeholder="e.g., Home, Work, Office"
                value={formData.label}
                onChange={(e) => handleChange("label", e.target.value)}
              />
            </div>

            {/* Street Line 1 */}
            <div className="grid gap-2">
              <Label htmlFor="street_line_1">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street_line_1"
                placeholder="123 Main Street"
                value={formData.street_line_1}
                onChange={(e) => handleChange("street_line_1", e.target.value)}
                required
              />
            </div>

            {/* Street Line 2 */}
            <div className="grid gap-2">
              <Label htmlFor="street_line_2">
                Apartment, suite, etc.{" "}
                <span className="text-gray-500 text-sm">(optional)</span>
              </Label>
              <Input
                id="street_line_2"
                placeholder="Apt 4B"
                value={formData.street_line_2}
                onChange={(e) => handleChange("street_line_2", e.target.value)}
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  placeholder="Boston"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="MA"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="zip_code">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zip_code"
                  placeholder="02101"
                  value={formData.zip_code}
                  onChange={(e) => handleChange("zip_code", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone Number{" "}
                <span className="text-gray-500 text-sm">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            {/* Set as Default */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) =>
                  handleChange("is_default", checked === true)
                }
              />
              <Label
                htmlFor="is_default"
                className="text-sm font-normal cursor-pointer"
              >
                Set as default shipping address
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : address
                  ? "Update Address"
                  : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
