import { Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { useAuth } from "@/app/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

interface ProfileProps {
  onNavigate: (view: string) => void;
}

export function Profile({ onNavigate }: ProfileProps) {
  const { t } = useI18n();

  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">{t("Please login to view your profile")}</p>
            <Button onClick={() => onNavigate("login")}>{t("Login")}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2">{t("My Profile")}</h1>
            <p className="text-gray-600">
              {t("View and manage your account information")}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("Profile Information")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("Name")}
                  </label>
                  <p className="text-lg">{user.name}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("Email")}
                  </label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("Account Type")}
                  </label>
                  <p className="text-lg capitalize flex items-center gap-2">
                    {user.is_admin ? (
                      <>
                        <Shield className="h-5 w-5 text-brand" />
                        {t("Administrator")}
                      </>
                    ) : (
                      "Customer"
                    )}
                  </p>
                </div>

                {user.is_admin && (
                  <>
                    <Separator />
                    <Button
                      onClick={() => onNavigate("admin")}
                      className="w-full bg-brand hover:bg-brand-dark"
                    >
                      {t("Go to Admin Dashboard")}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
