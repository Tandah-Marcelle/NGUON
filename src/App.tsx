import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ShimmerLoader from "./components/ShimmerLoader";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const MediaManagement = lazy(() => import("./pages/admin/MediaManagement"));
const MediaCreate = lazy(() => import("./pages/admin/MediaCreate"));
const ProgrammeManagement = lazy(() => import("./pages/admin/ProgrammeManagement"));
const ProgrammeCreate = lazy(() => import("./pages/admin/ProgrammeCreate"));
const ActivitiesManagement = lazy(() => import("./pages/admin/ActivitiesManagement"));
const ActivitiesCreate = lazy(() => import("./pages/admin/ActivitiesCreate"));
const AdminActualities = lazy(() => import("./pages/admin/AdminActualities"));
const AdminSponsors = lazy(() => import("./pages/admin/AdminSponsors"));
const ContactsManagement = lazy(() => import("./pages/admin/ContactsManagement"));
const ContactView = lazy(() => import("./pages/admin/ContactView"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));
const RolesManagement = lazy(() => import("./pages/admin/RolesManagement"));
const RolesCreate = lazy(() => import("./pages/admin/RolesCreate"));
const UsersManagement = lazy(() => import("./pages/admin/UsersManagement"));
const UsersCreate = lazy(() => import("./pages/admin/UsersCreate"));
const ConcoursManagement = lazy(() => import("./pages/admin/ConcoursManagement"));
const ConcoursForm = lazy(() => import("./pages/admin/ConcoursForm"));
const ConcoursPublic = lazy(() => import("./pages/ConcoursPublic"));
const InscriptionConcours = lazy(() => import("./pages/InscriptionConcours"));
const CandidatsManagement = lazy(() => import("./pages/admin/CandidatsManagement"));
const Sites = lazy(() => import("./pages/admin/Sites"));
const SiteForm = lazy(() => import("./pages/admin/SiteForm"));
const SiteView = lazy(() => import("./pages/admin/SiteView"));

const queryClient = new QueryClient();

const AppContent = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Suspense fallback={<ShimmerLoader />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/concours" element={<ConcoursPublic />} />
        <Route path="/concours/inscription" element={<InscriptionConcours />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
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
          <Route path="actualities" element={<AdminActualities />} />
          <Route path="sponsors" element={<AdminSponsors />} />
          <Route path="messages" element={<MessageManagement />} />
          <Route path="contacts" element={<ContactsManagement />} />
          <Route path="contacts/view/:id" element={<ContactView />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="users/create" element={<UsersCreate />} />
          <Route path="users/edit/:id" element={<UsersCreate />} />
          <Route path="roles" element={<RolesManagement />} />
          <Route path="roles/create" element={<RolesCreate />} />
          <Route path="roles/edit/:id" element={<RolesCreate />} />
          <Route path="sites" element={<Sites />} />
          <Route path="sites/create" element={<SiteForm />} />
          <Route path="sites/edit/:id" element={<SiteForm />} />
          <Route path="sites/:id" element={<SiteView />} />
          <Route path="concours" element={<ConcoursManagement />} />
          <Route path="concours/create" element={<ConcoursForm />} />
          <Route path="concours/edit/:id" element={<ConcoursForm />} />
          <Route path="candidats" element={<CandidatsManagement />} />
        </Route>
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
