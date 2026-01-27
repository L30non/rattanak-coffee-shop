import { useState } from "react";
import Image from "next/image";
import {
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Truck,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useStore, type Order } from "@/app/store/useStore";
import { useAuth } from "@/app/hooks/useAuth";
import {
  useProducts,
  useAddProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/app/hooks/useProducts";
import type { Product } from "@/app/store/useStore";
import { toast } from "sonner";
import { uploadImage, getImageUrl } from "@/utils/supabase/client";

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  const { data: products = [] } = useProducts();
  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "beans" as "machines" | "beans" | "accessories" | "ingredients",
    price: "",
    description: "",
    image: null as string | null,
    stock: "",
    roast_level: "",
    origin: "",
    weight: "",
  });

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const { path, error } = await uploadImage(file);
    setIsUploading(false);

    if (error) {
      toast.error(`Upload failed: ${error}`);
      return;
    }

    if (path) {
      if (isEdit && editingProduct) {
        setEditingProduct({ ...editingProduct, image: path });
      } else {
        setNewProduct({ ...newProduct, image: path });
      }
      toast.success("Image uploaded successfully");
    }
  };

  if (!user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <p className="text-lg mb-4">Access Denied</p>
            <Button onClick={() => onNavigate("home")}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      image: newProduct.image || null,
      stock: parseInt(newProduct.stock),
      roast_level: newProduct.roast_level || null,
      origin: newProduct.origin || null,
      weight: newProduct.weight || null,
      features: [] as string[] | null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addProductMutation.mutate(productData, {
      onSuccess: () => {
        toast.success("Product added successfully");
        setIsAddDialogOpen(false);
        setNewProduct({
          name: "",
          category: "beans",
          price: "",
          description: "",
          image: null,
          stock: "",
          roast_level: "",
          origin: "",
          weight: "",
        });
      },
      onError: (error) => {
        toast.error(`Failed to add product: ${error.message}`);
      },
    });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate(
        {
          ...editingProduct,
          id: editingProduct.id,
        },
        {
          onSuccess: () => {
            toast.success("Product updated successfully");
            setIsEditDialogOpen(false);
            setEditingProduct(null);
          },
          onError: (error) => {
            toast.error(`Failed to update product: ${error.message}`);
          },
        },
      );
    }
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProductMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Product deleted successfully");
        },
        onError: (error) => {
          toast.error(`Failed to delete product: ${error.message}`);
        },
      });
    }
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: Order["status"],
  ) => {
    updateOrderStatus(orderId, status);
    toast.success("Order status updated!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage your store, products, and orders
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Low Stock Items</p>
                  <p className="text-2xl font-bold">{lowStockProducts}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-[#5F1B2C] hover:bg-[#4a1523]">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddProduct} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Product Name *</Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(
                              value:
                                | "machines"
                                | "beans"
                                | "accessories"
                                | "ingredients",
                            ) =>
                              setNewProduct({ ...newProduct, category: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="machines">Machines</SelectItem>
                              <SelectItem value="beans">Beans</SelectItem>
                              <SelectItem value="accessories">
                                Accessories
                              </SelectItem>
                              <SelectItem value="ingredients">
                                Ingredients
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price">Price *</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={newProduct.price}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  price: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="stock">Stock *</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={newProduct.stock}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  stock: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                description: e.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="image">Product Image</Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                id="imageUpload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, false)}
                                disabled={isUploading}
                                className="flex-1"
                              />
                              {isUploading && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              )}
                            </div>
                            {newProduct.image && (
                              <div className="flex items-center gap-2">
                                <div className="relative h-16 w-16 rounded overflow-hidden">
                                  <Image
                                    src={getImageUrl(newProduct.image) || ""}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="text-sm text-gray-500 truncate flex-1">
                                  {newProduct.image}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setNewProduct({
                                      ...newProduct,
                                      image: null,
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="roastLevel">Roast Level</Label>
                            <Input
                              id="roastLevel"
                              value={newProduct.roast_level}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  roast_level: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="origin">Origin</Label>
                            <Input
                              id="origin"
                              value={newProduct.origin}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  origin: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="weight">Weight/Size</Label>
                            <Input
                              id="weight"
                              value={newProduct.weight}
                              onChange={(e) =>
                                setNewProduct({
                                  ...newProduct,
                                  weight: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
                        >
                          Add Product
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell className="capitalize">
                            {product.category}
                          </TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.stock < 10 ? "destructive" : "default"
                              }
                            >
                              {product.stock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleDeleteProduct(product.id, product.name)
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">
                    No orders yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="pt-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                Order #{order.id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(
                                  order.created_at,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-[#3d1620]">
                                ${order.total.toFixed(2)}
                              </span>
                              <Select
                                value={order.status}
                                onValueChange={(
                                  value:
                                    | "pending"
                                    | "processing"
                                    | "shipped"
                                    | "delivered",
                                ) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="processing">
                                    Processing
                                  </SelectItem>
                                  <SelectItem value="shipped">
                                    Shipped
                                  </SelectItem>
                                  <SelectItem value="delivered">
                                    Delivered
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="text-sm space-y-2">
                            <div>
                              <span className="font-medium">Items:</span>
                              {order.items?.map((item) => (
                                <p
                                  key={item.product.id}
                                  className="text-gray-600"
                                >
                                  {item.product.name} x{item.quantity}
                                </p>
                              ))}
                            </div>
                            <div>
                              <span className="font-medium">Payment:</span>
                              <p className="text-gray-600 flex items-center gap-1">
                                <Truck className="h-4 w-4" /> Cash on Delivery
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Product Name *</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select
                    value={editingProduct.category}
                    onValueChange={(
                      value:
                        | "machines"
                        | "beans"
                        | "accessories"
                        | "ingredients",
                    ) =>
                      setEditingProduct({ ...editingProduct, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="machines">Machines</SelectItem>
                      <SelectItem value="beans">Beans</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="ingredients">Ingredients</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Price *</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-stock">Stock *</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-image">Product Image</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="edit-imageUpload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        disabled={isUploading}
                        className="flex-1"
                      />
                      {isUploading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                    {editingProduct.image && (
                      <div className="flex items-center gap-2">
                        <div className="relative h-16 w-16 rounded overflow-hidden">
                          <Image
                            src={getImageUrl(editingProduct.image) || ""}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-500 truncate flex-1">
                          {editingProduct.image}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setEditingProduct({
                              ...editingProduct,
                              image: null,
                            })
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
                >
                  Update Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
