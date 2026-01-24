'use client';

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from '@/app/components/Header';
import { HomePage } from '@/app/components/HomePage';
import { ProductList } from '@/app/components/ProductList';
import { ProductDetail } from '@/app/components/ProductDetail';
import { Cart } from '@/app/components/Cart';
import { Checkout } from '@/app/components/Checkout';
import { Auth } from '@/app/components/Auth';
import { Account } from '@/app/components/Account';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { Toaster } from '@/app/components/ui/sonner';

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
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const renderView = () => {
    // Product detail pages
    if (currentView.startsWith('product-')) {
      const productId = currentView.replace('product-', '');
      return <ProductDetail productId={productId} onNavigate={setCurrentView} />;
    }

    // Other views
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />;
      case 'products':
        return <ProductList category="all" searchQuery={searchQuery} onNavigate={setCurrentView} />;
      case 'machines':
        return <ProductList category="machines" searchQuery={searchQuery} onNavigate={setCurrentView} />;
      case 'beans':
        return <ProductList category="beans" searchQuery={searchQuery} onNavigate={setCurrentView} />;
      case 'accessories':
        return <ProductList category="accessories" searchQuery={searchQuery} onNavigate={setCurrentView} />;
      case 'ingredients':
        return <ProductList category="ingredients" searchQuery={searchQuery} onNavigate={setCurrentView} />;
      case 'cart':
        return <Cart onNavigate={setCurrentView} />;
      case 'checkout':
        return <Checkout onNavigate={setCurrentView} />;
      case 'login':
        return <Auth onNavigate={setCurrentView} />;
      case 'account':
        return <Account onNavigate={setCurrentView} />;
      case 'admin':
        return <AdminDashboard onNavigate={setCurrentView} />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onNavigate={setCurrentView}
        currentView={currentView}
        onSearchChange={setSearchQuery}
      />
      <main>{renderView()}</main>
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}