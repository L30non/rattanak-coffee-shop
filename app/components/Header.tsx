import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  Shield,
  MapPin,
  Mail,
  Facebook,
  Send,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { useStore } from "@/app/store/useStore";
import { useAuth } from "@/app/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { toast } from "sonner";
import { getImageUrl } from "@/utils/supabase/client";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  const navItems = [
    { label: "Home", value: "home" },
    { label: "About Us", value: "about" },
    { label: "Blog", value: "blog" },
    { label: "Gallery", value: "gallery" },
    { label: "Contact", value: "contact" },
  ];

  const productCategories = [
    { label: "Machines", value: "machines" },
    { label: "Beans", value: "beans" },
    { label: "Accessories", value: "accessories" },
    { label: "Ingredients", value: "ingredients" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#5F1B2C] text-white text-sm hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Left: Contact Info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>#20E0, St.85BT, Phum Chamroeun Phal</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:info@rattanakcoffee.com"
                  className="hover:text-rose-200 transition-colors"
                >
                  info@rattanakcoffee.com
                </a>
              </div>
            </div>

            {/* Right: Social Media */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/rattanakcoffeeroaster"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/rattanakcoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-200 transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@rattanakcoffee"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose-200 transition-colors"
                aria-label="TikTok"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={
                    getImageUrl(
                      "https://amsvlqivarurifjhboef.supabase.co/storage/v1/object/public/Images/branding/Rattanak.webp",
                    ) || "/Rattanak.webp"
                  }
                  alt="Rattanak Coffee Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl text-[#5F1B2C] hidden sm:inline">
                RATTANAK COFFEE
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onNavigate(item.value)}
                  className={`text-sm font-medium transition-colors hover:text-[#5F1B2C] ${
                    currentView === item.value
                      ? "text-[#5F1B2C] font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`text-sm font-medium transition-colors hover:text-[#5F1B2C] flex items-center gap-1 ${
                      currentView === "products" ||
                      productCategories.some((cat) => cat.value === currentView)
                        ? "text-[#5F1B2C] font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    Products
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => onNavigate("products")}>
                    All Products
                  </DropdownMenuItem>
                  {productCategories.map((category) => (
                    <DropdownMenuItem
                      key={category.value}
                      onClick={() => onNavigate(category.value)}
                    >
                      {category.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {user?.is_admin && (
                <button
                  onClick={() => onNavigate("admin")}
                  className={`text-sm font-medium transition-colors hover:text-[#5F1B2C] ${
                    currentView === "admin"
                      ? "text-[#5F1B2C] font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  Admin
                </button>
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search - Desktop */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => onNavigate("cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <motion.div
                    key={cartItemCount}
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-[#5F1B2C]">
                      {cartItemCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>

              {/* User Account */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  {user.is_admin && (
                    <Badge
                      variant="secondary"
                      className="bg-rose-50 text-[#5F1B2C]"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#5F1B2C] text-white text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {!user.is_admin && (
                        <DropdownMenuItem
                          onClick={() => onNavigate("account")}
                          className="cursor-pointer"
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          <span>Orders</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => onNavigate("address")}
                        className="cursor-pointer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>Address</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onNavigate("settings")}
                        className="cursor-pointer"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Settings</span>
                      </DropdownMenuItem>
                      {user.is_admin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onNavigate("admin")}
                            className="cursor-pointer"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onNavigate("login")}
                  className="hidden md:flex bg-[#5F1B2C] hover:bg-[#4a1523]"
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
                        className="w-full pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5F1B2C]"
                      />
                    </div>

                    {/* Mobile Navigation */}
                    {navItems.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => onNavigate(item.value)}
                        className={`text-left px-4 py-2 rounded-md transition-colors ${
                          currentView === item.value
                            ? "bg-rose-50 text-[#5F1B2C] font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}

                    {/* Mobile Products Menu */}
                    <div className="border-t pt-2">
                      <p className="px-4 py-2 text-sm font-semibold text-gray-500">
                        Products
                      </p>
                      <button
                        onClick={() => onNavigate("products")}
                        className={`text-left px-4 py-2 rounded-md transition-colors w-full ${
                          currentView === "products"
                            ? "bg-rose-50 text-[#5F1B2C] font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        All Products
                      </button>
                      {productCategories.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => onNavigate(category.value)}
                          className={`text-left px-4 py-2 rounded-md transition-colors w-full ${
                            currentView === category.value
                              ? "bg-rose-50 text-[#5F1B2C] font-semibold"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>

                    {user?.is_admin && (
                      <button
                        onClick={() => onNavigate("admin")}
                        className={`text-left px-4 py-2 rounded-md transition-colors ${
                          currentView === "admin"
                            ? "bg-rose-50 text-[#5F1B2C] font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        Admin Dashboard
                      </button>
                    )}

                    {/* Mobile User Actions */}
                    {user ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#5F1B2C] text-white">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => onNavigate("profile")}
                          className="w-full justify-start"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onNavigate("account")}
                          className="w-full justify-start"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Orders
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onNavigate("address")}
                          className="w-full justify-start"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Address
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => onNavigate("settings")}
                          className="w-full justify-start"
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Settings
                        </Button>
                        {user.is_admin && (
                          <Button
                            variant="outline"
                            onClick={() => onNavigate("admin")}
                            className="w-full justify-start"
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={handleLogout}
                          className="w-full justify-start text-red-600 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="default"
                        onClick={() => onNavigate("login")}
                        className="w-full bg-[#5F1B2C] hover:bg-[#4a1523]"
                      >
                        Login
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Expandable Search Bar - Desktop Only */}
          {isSearchOpen && (
            <div className="hidden md:block border-t bg-white py-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5F1B2C]"
                  />
                </div>
                <Button
                  onClick={() => onNavigate("products")}
                  className="bg-[#5F1B2C] hover:bg-[#4a1523] px-6"
                >
                  Go
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
