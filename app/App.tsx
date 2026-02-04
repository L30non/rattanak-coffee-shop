"use client";

import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/app/components/Header";
import { HomePage } from "@/app/components/HomePage";
import { ProductList } from "@/app/components/ProductList";
import { ProductDetail } from "@/app/components/ProductDetail";
import { Cart } from "@/app/components/Cart";
import { Checkout } from "@/app/components/Checkout";
import { Auth } from "@/app/components/Auth";
import { Account } from "@/app/components/Account";
import { Profile } from "@/app/components/Profile";
import { AdminDashboard } from "@/app/components/AdminDashboard";
import { AddressManagement } from "@/app/components/AddressManagement";
import { Settings } from "@/app/components/Settings";
import { Toaster } from "@/app/components/ui/sonner";
import { Button } from "@/app/components/ui/button";
import { TermsOfService } from "@/app/components/TermsOfService";
import { PrivacyPolicy } from "@/app/components/PrivacyPolicy";
import { RefundPolicy } from "@/app/components/RefundPolicy";
import { Footer } from "@/app/components/Footer";
import ErrorBoundary from "@/app/components/ErrorBoundary";

// Create a client for React Query (TanStack Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderView = () => {
    // Product detail pages
    if (currentView.startsWith("product-")) {
      const productId = currentView.replace("product-", "");
      return (
        <ProductDetail productId={productId} onNavigate={setCurrentView} />
      );
    }

    // Other views
    switch (currentView) {
      case "home":
        return <HomePage onNavigate={setCurrentView} />;
      case "products":
        return (
          <ProductList
            category="all"
            searchQuery={searchQuery}
            onNavigate={setCurrentView}
          />
        );
      case "machines":
        return (
          <ProductList
            category="machines"
            searchQuery={searchQuery}
            onNavigate={setCurrentView}
          />
        );
      case "beans":
        return (
          <ProductList
            category="beans"
            searchQuery={searchQuery}
            onNavigate={setCurrentView}
          />
        );
      case "accessories":
        return (
          <ProductList
            category="accessories"
            searchQuery={searchQuery}
            onNavigate={setCurrentView}
          />
        );
      case "ingredients":
        return (
          <ProductList
            category="ingredients"
            searchQuery={searchQuery}
            onNavigate={setCurrentView}
          />
        );
      case "cart":
        return <Cart onNavigate={setCurrentView} />;
      case "checkout":
        return <Checkout onNavigate={setCurrentView} />;
      case "login":
        return <Auth onNavigate={setCurrentView} />;
      case "account":
        return <Account onNavigate={setCurrentView} />;
      case "profile":
        return <Profile onNavigate={setCurrentView} />;
      case "admin":
        return <AdminDashboard onNavigate={setCurrentView} />;
      case "address":
        return <AddressManagement onNavigate={setCurrentView} />;
      case "settings":
        return <Settings onNavigate={setCurrentView} />;
      case "terms":
        return <TermsOfService onNavigate={setCurrentView} />;
      case "privacy":
        return <PrivacyPolicy onNavigate={setCurrentView} />;
      case "refund":
        return <RefundPolicy onNavigate={setCurrentView} />;
      case "about":
        return (
          <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">About Us</h1>
              <p className="text-gray-600">Coming Soon...</p>
            </div>
          </div>
        );
      case "blog":
        return (
          <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">Blog</h1>
              <p className="text-gray-600">Coming Soon...</p>
            </div>
          </div>
        );
      case "gallery":
        return (
          <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">Gallery</h1>
              <p className="text-gray-600">Coming Soon...</p>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="min-h-screen bg-gray-50 py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl font-bold mb-4">Contact</h1>
              <p className="text-gray-600">Coming Soon...</p>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onNavigate={setCurrentView}
        currentView={currentView}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onNavigate={setCurrentView} />
      <Toaster position="top-center" closeButton />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
