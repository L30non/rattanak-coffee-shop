import { Package, Clock, Truck, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { useAuth } from "@/app/hooks/useAuth";
import { useOrders, useDeleteOrder } from "@/app/hooks/useProducts";
import { toast } from "sonner";

interface AccountProps {
  onNavigate: (view: string) => void;
}

export function Account({ onNavigate }: AccountProps) {
  const { user } = useAuth();
  const { data: orders = [], isLoading } = useOrders(user?.id);
  const deleteOrderMutation = useDeleteOrder();

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      toast.success("Order deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete order",
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">Please login to view your orders</p>
            <Button onClick={() => onNavigate("login")}>Login</Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl mb-2">My Orders</h1>
            <p className="text-gray-600">View and track your order history</p>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  Start shopping to see your orders here
                </p>
                <Button
                  onClick={() => onNavigate("products")}
                  className="bg-[#5F1B2C] hover:bg-[#4a1523]"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.id}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Clock className="h-4 w-4" />
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-700">
                            {item.product.name} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-[#3d1620]">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mt-4">
                        <p className="font-medium mb-1">Shipping Address:</p>
                        <p>{order.shipping_address}</p>
                      </div>

                      {order.tracking_number && (
                        <div className="text-sm mt-3">
                          <p className="font-medium mb-1 text-gray-700">
                            Tracking Number:
                          </p>
                          <Badge variant="outline" className="font-mono">
                            {order.tracking_number}
                          </Badge>
                          {order.shipping_carrier && (
                            <span className="text-gray-600 ml-2">
                              via {order.shipping_carrier}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-sm text-gray-600 mt-3">
                        <p className="font-medium mb-1">Payment Method:</p>
                        <p className="flex items-center gap-1">
                          <Truck className="h-4 w-4" /> Cash on Delivery
                        </p>
                      </div>

                      {(order.status === "delivered" ||
                        order.status === "cancelled") && (
                        <div className="pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deleteOrderMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deleteOrderMutation.isPending
                              ? "Deleting..."
                              : "Delete Order"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
