"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useAuth } from "@/app/hooks/useAuth";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export function ProfileEdit() {
  const { t } = useI18n();

  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(t("Name is required"));
      return;
    }

    if (!formData.email.trim()) {
      toast.error(t("Email is required"));
      return;
    }

    setIsSaving(true);
    const result = await updateProfile(formData.name, formData.email);

    if (result.success) {
      toast.success(t("Profile updated successfully"));
      setIsEditing(false);
    } else {
      toast.error(result.error || "Failed to update profile");
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t("Profile Information")}</CardTitle>
        <CardDescription>{t("Update your personal information")}</CardDescription>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("Full Name *")}</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("Enter your full name")}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("Email Address *")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("Enter your email")}
                required
              />
              <p className="text-xs text-gray-500">
                {t("Changing your email will require verification")}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#5F1B2C] hover:bg-[#4a1523]"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                {t("Cancel")}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Display Mode */}
            <div className="space-y-2">
              <Label className="text-gray-600">{t("Full Name")}</Label>
              <p className="text-lg font-medium text-gray-900">{user?.name}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">{t("Email Address")}</Label>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>

            {user?.is_admin && (
              <div className="space-y-2">
                <Label className="text-gray-600">{t("Account Type")}</Label>
                <p className="text-lg font-medium text-gray-900">
                  <span className="inline-block px-3 py-1 bg-[#5F1B2C] text-white text-sm rounded-full">
                    {t("Administrator")}
                  </span>
                </p>
              </div>
            )}

            {/* Edit Button */}
            <div className="pt-4">
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#5F1B2C] hover:bg-[#4a1523]"
              >
                {t("Edit Profile")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
