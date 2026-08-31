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

export function SecurityChangePassword() {
  const { t } = useI18n();

  const { changePassword } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword.trim()) {
      toast.error(t("Current password is required"));
      return;
    }

    if (!formData.newPassword.trim()) {
      toast.error(t("New password is required"));
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error(t("New password must be at least 6 characters"));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("New passwords do not match"));
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error(t("New password must be different from current password"));
      return;
    }

    setIsSaving(true);
    const result = await changePassword(
      formData.currentPassword,
      formData.newPassword,
    );

    if (result.success) {
      toast.success(t("Password changed successfully"));
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      toast.error(result.error || "Failed to change password");
    }

    setIsSaving(false);
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{t("Change Password")}</CardTitle>
        <CardDescription>
          {t("Update your password to keep your account secure")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">{t("Current Password *")}</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder={t("Enter your current password")}
              required
            />
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">{t("New Password *")}</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder={t("Enter your new password")}
              required
            />
            <p className="text-xs text-gray-500">
              {t("Must be at least 6 characters")}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("Confirm New Password *")}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t("Confirm your new password")}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#5F1B2C] hover:bg-[#4a1523]"
            >
              {isSaving ? "Updating..." : "Update Password"}
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>{t("Security Tip:")}</strong> {t("Use a strong password with a mix of uppercase, lowercase, numbers, and special characters.")}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
