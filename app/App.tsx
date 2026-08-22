"use client";

import { useCallback, useEffect, useState } from "react";
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
import { AboutUs } from "@/app/components/AboutUs";
import { Business } from "@/app/components/Business";
import { Gallery } from "@/app/components/Gallery";
import { Contact } from "@/app/components/Contact";
import { Footer } from "@/app/components/Footer";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import { toast } from "sonner";
import { parseCatalogView } from "@/lib/categories";
import { hrefToView, viewToHref } from "@/lib/routes";

// Create a client for React Query (TanStack Query)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

interface AppContentProps {
  initialView: string;
}

function AppContent({ initialView }: AppContentProps) {
  const [currentView, setCurrentView] = useState(initialView);
  const [searchQuery, setSearchQuery] = useState("");

  // The single navigation entry point: updates the visible view and keeps
  // the URL (and therefore the back/forward button and refresh) in sync.
  // Skip the pushState when the URL already matches — e.g. re-selecting the
  // current nav item — so we don't pile up no-op history entries.
  const navigate = useCallback((view: string) => {
    setCurrentView(view);
    const href = viewToHref(view);
    if (href !== window.location.pathname) {
      window.history.pushState({ view }, "", href);
    }
  }, []);

  // Browser back/forward: derive the view from the URL popstate lands on
  // rather than from event.state, so it also works for entries created
  // before this history sync existed.
  useEffect(() => {
    // setCurrentView directly, not navigate() — the URL has already moved,
    // so there is nothing to push back onto history.
    const onPopState = () => {
      setCurrentView(hrefToView(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const confirmed = params.get("confirmed");
    const authError = params.get("auth_error");

    if (confirmed || authError) {
      if (confirmed) {
        toast.success("Email confirmed — you're now signed in!");
      } else if (authError) {
        toast.error(`Sign-in link failed: ${authError}`);
      }
      params.delete("confirmed");
      params.delete("auth_error");
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (query ? `?${query}` : ""),
      );
    }
  }, []);

  const renderView = () => {
    // Product detail pages
    if (currentView.startsWith("product-")) {
      const productId = currentView.replace("product-", "");
      return (
        <ProductDetail productId={productId} onNavigate={navigate} />
      );
    }

    // Category / sub-category product pages, e.g. "machines" or "machines/2-group"
    const catalog = parseCatalogView(currentView);
    if (catalog) {
      return (
        <ProductList
          category={catalog.category}
          subcategory={catalog.subcategory}
          searchQuery={searchQuery}
          onNavigate={navigate}
        />
      );
    }

    // Other views
    switch (currentView) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "products":
        return (
          <ProductList
            category="all"
            searchQuery={searchQuery}
            onNavigate={navigate}
          />
        );
      case "cart":
        return <Cart onNavigate={navigate} />;
      case "checkout":
        return <Checkout onNavigate={navigate} />;
      case "login":
        return <Auth onNavigate={navigate} />;
      case "account":
        return <Account onNavigate={navigate} />;
      case "profile":
        return <Profile onNavigate={navigate} />;
      case "admin":
        return <AdminDashboard onNavigate={navigate} />;
      case "address":
        return <AddressManagement onNavigate={navigate} />;
      case "settings":
        return <Settings onNavigate={navigate} />;
      case "terms":
        return <TermsOfService onNavigate={navigate} />;
      case "privacy":
        return <PrivacyPolicy onNavigate={navigate} />;
      case "refund":
        return <RefundPolicy onNavigate={navigate} />;
      case "about":
        return <AboutUs onNavigate={navigate} />;
      case "business":
        return <Business onNavigate={navigate} />;
      case "gallery":
        return <Gallery onNavigate={navigate} />;
      case "contact":
        return <Contact onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        onNavigate={navigate}
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
      <Footer onNavigate={navigate} />
      <Toaster position="top-center" closeButton />
    </div>
  );
}

interface AppProps {
  /** The view to render on first paint, resolved server-side from the URL. */
  initialView?: string;
}

export default function App({ initialView = "home" }: AppProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent initialView={initialView} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
