"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { useStore, Address } from "@/app/store/useStore";
import { AddressForm } from "@/app/components/AddressForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { toast } from "sonner";

interface AddressManagementProps {
  onNavigate: (view: string) => void;
}

export function AddressManagement({ onNavigate }: AddressManagementProps) {
  const { addresses, setAddresses, deleteAddress, setDefaultAddress } =
    useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/addresses");
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
      } else {
        toast.error("Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingAddressId) return;

    try {
      const response = await fetch(`/api/addresses/${deletingAddressId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        deleteAddress(deletingAddressId);
        toast.success("Address deleted successfully");
      } else {
        toast.error("Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-default" }),
      });

      if (response.ok) {
        setDefaultAddress(addressId);
        toast.success("Default address updated");
      } else {
        toast.error("Failed to set default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.street_line_1,
      address.street_line_2,
      address.city,
      address.state,
      address.zip_code,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Addresses
            </h1>
            <p className="text-gray-600">
              Manage your shipping addresses for faster checkout
            </p>
          </div>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading addresses...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && addresses.length === 0 && (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
              <p className="text-gray-600 mb-6">
                Add your first address to make checkout faster and easier
              </p>
              <Button onClick={handleAddNew} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Address
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Address List */}
        {!isLoading && addresses.length > 0 && (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`transition-all ${
                  address.is_default
                    ? "border-[#5F1B2C] border-2 shadow-md"
                    : "hover:shadow-md"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        {address.label && (
                          <span className="font-semibold text-lg">
                            {address.label}
                          </span>
                        )}
                        {address.is_default && (
                          <Badge className="bg-[#5F1B2C] hover:bg-[#5F1B2C]">
                            <Star className="h-3 w-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-700 mb-1">
                        {formatAddress(address)}
                      </p>
                      {address.phone && (
                        <p className="text-gray-600 text-sm">
                          Phone: {address.phone}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!address.is_default && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          title="Set as default"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(address)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingAddressId(address.id)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8">
          <Button variant="outline" onClick={() => onNavigate("account")}>
            Back to Account
          </Button>
        </div>
      </div>

      {/* Address Form Dialog */}
      <AddressForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        address={editingAddress}
        onSuccess={fetchAddresses}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingAddressId}
        onOpenChange={(open) => !open && setDeletingAddressId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
