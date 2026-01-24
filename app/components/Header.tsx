import { ShoppingCart, User, Coffee, Search, Menu, Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { useStore } from "@/app/store/useStore";
import { useAuth } from "@/app/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { toast } from "sonner";

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onSearchChange: (search: string) => void;
}

export function Header({
  onNavigate,
  currentView,
  onSearchChange,
}: HeaderProps) {
  const cart = useStore((state) => state.cart);
  const { user, signOut } = useAuth();

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    // Navigate to products page when searching from home
    if (value && currentView === "home") {
      onNavigate("products");
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success("Logged out successfully");
      onNavigate("home");
    } else {
      toast.error("Failed to logout");
    }
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Admin users see Admin Dashboard link
  const navItems = user?.is_admin
    ? [
        { label: "Home", value: "home" },
        { label: "Products", value: "products" },
        { label: "Machines", value: "machines" },
        { label: "Beans", value: "beans" },
        { label: "Accessories", value: "accessories" },
        { label: "Ingredients", value: "ingredients" },
        { label: "Admin", value: "admin" },
      ]
    : [
        { label: "Home", value: "home" },
        { label: "Products", value: "products" },
        { label: "Machines", value: "machines" },
        { label: "Beans", value: "beans" },
        { label: "Accessories", value: "accessories" },
        { label: "Ingredients", value: "ingredients" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Coffee className="h-8 w-8 text-amber-700" />
            <span className="font-bold text-xl text-amber-900">
              Rattanak Coffee
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium transition-colors hover:text-amber-700 ${
                  currentView === item.value
                    ? "text-amber-700"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search - Desktop */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8 pr-4 py-2 border rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => onNavigate("cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-amber-600">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Account */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {user.is_admin && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  onClick={() =>
                    onNavigate(user.is_admin ? "admin" : "account")
                  }
                >
                  <User className="h-5 w-5 mr-2" />
                  {user.name}
                </Button>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => onNavigate("login")}
                className="hidden md:flex bg-amber-700 hover:bg-amber-800"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  {navItems.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => onNavigate(item.value)}
                      className={`text-left px-4 py-2 rounded-md transition-colors ${
                        currentView === item.value
                          ? "bg-amber-100 text-amber-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  {/* Mobile User Actions */}
                  {user ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() =>
                          onNavigate(user.is_admin ? "admin" : "account")
                        }
                        className="w-full"
                      >
                        <User className="h-5 w-5 mr-2" />
                        {user.name}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => onNavigate("login")}
                      className="w-full bg-amber-700 hover:bg-amber-800"
                    >
                      Login
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
