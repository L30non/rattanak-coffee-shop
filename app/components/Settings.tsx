"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { User, Lock } from "lucide-react";
import { ProfileEdit } from "@/app/components/ProfileEdit";
import { SecurityChangePassword } from "@/app/components/SecurityChangePassword";

interface SettingsProps {
  onNavigate: (view: string) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<"profile" | "security">(
    "profile",
  );

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account and security settings
          </p>
        </div>

        {/* Sidebar + Content Layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-lg shadow divide-y">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      setActiveSection(item.id as "profile" | "security")
                    }
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-[#5F1B2C] text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {activeSection === "profile" && <ProfileEdit />}
              {activeSection === "security" && <SecurityChangePassword />}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => onNavigate("account")}>
            Back to Account
          </Button>
        </div>
      </div>
    </div>
  );
}
