// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingProvider from "@/context/LoadingContext";
import ShippingPolicy from "@/pages/ShippingPolicy";

// Public pages
import Index from "./pages/Index";
import Registration from "./pages/Registration";
import Payment from "./pages/Payment";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import Exam from "./pages/Exam";
import ExamResult from "./pages/ExamResult";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import AboutUs from "./pages/AboutUs";
import CancellationRefund from "./pages/CancellationRefund";
import Gallery from "./pages/Gallery";

// Admin
import AdminGuard from "@/admin/AdminGuard";
import AdminDashboard from "@/admin/AdminDashboard";
import AdminGallery from "@/admin/AdminGallery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LoadingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam-result" element={<ExamResult />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />


            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <AdminGuard>
                  <AdminGallery />
                </AdminGuard>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
