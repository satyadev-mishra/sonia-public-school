import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import PreboardForm from "./pages/PreboardForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const pageTitles = {
    '/': 'Sonia Public Sr. Sec. School',
    '/login': 'Login - Sonia Public Sr. Sec. School',
    '/preboard-form': 'Preboard 2025-26 - Sonia Public Sr. Sec. School',
    '/admin/dashboard': 'Dashboard - Sonia Public Sr. Sec. School',
    '/admin/students': 'Students - Sonia Public Sr. Sec. School',
  };

  useDocumentTitle(pageTitles);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/preboard-form" element={<PreboardForm />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute requireAdmin><Students /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;