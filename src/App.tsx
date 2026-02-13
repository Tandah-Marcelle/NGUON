import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MediaManagement from "./pages/admin/MediaManagement";
import MediaCreate from "./pages/admin/MediaCreate";
import ProgrammeManagement from "./pages/admin/ProgrammeManagement";
import ProgrammeCreate from "./pages/admin/ProgrammeCreate";
import ActivitiesManagement from "./pages/admin/ActivitiesManagement";
import ActivitiesCreate from "./pages/admin/ActivitiesCreate";
import ContactsManagement from "./pages/admin/ContactsManagement";
import ContactView from "./pages/admin/ContactView";
import RolesManagement from "./pages/admin/RolesManagement";
import RolesCreate from "./pages/admin/RolesCreate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="media" element={<MediaManagement />} />
            <Route path="media/create" element={<MediaCreate />} />
            <Route path="media/edit/:id" element={<MediaCreate />} />
            <Route path="programme" element={<ProgrammeManagement />} />
            <Route path="programme/create" element={<ProgrammeCreate />} />
            <Route path="programme/edit/:id" element={<ProgrammeCreate />} />
            <Route path="activities" element={<ActivitiesManagement />} />
            <Route path="activities/create" element={<ActivitiesCreate />} />
            <Route path="activities/edit/:id" element={<ActivitiesCreate />} />
            <Route path="contacts" element={<ContactsManagement />} />
            <Route path="contacts/view/:id" element={<ContactView />} />
            <Route path="roles" element={<RolesManagement />} />
            <Route path="roles/create" element={<RolesCreate />} />
            <Route path="roles/edit/:id" element={<RolesCreate />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
