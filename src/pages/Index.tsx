import { Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import ShimmerLoader from "@/components/ShimmerLoader";
import CursorTrail from "@/components/CursorTrail";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingActions from "@/components/FloatingActions";

// Lazy load non-critical sections
const AboutSection = lazy(() => import("@/components/AboutSection"));
const StatsSection = lazy(() => import("@/components/StatsSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const ProgramSection = lazy(() => import("@/components/ProgramSection"));
const ConcoursCTASection = lazy(() => import("@/components/ConcoursCTASection"));
const VoteCTASection = lazy(() => import("@/components/VoteCTASection"));
const ParticipateSection = lazy(() => import("@/components/ParticipateSection"));
const SitesSection = lazy(() => import("@/components/SitesSection"));
const RitualsSection = lazy(() => import("@/components/RitualsSection"));
const ActualitesSection = lazy(() => import("@/components/ActualitesSection"));
const ObjectivesSection = lazy(() => import("@/components/ObjectivesSection"));
const ImpactSection = lazy(() => import("@/components/ImpactSection"));
const VisitorsSection = lazy(() => import("@/components/VisitorsSection"));
const MessagesSection = lazy(() => import("@/components/MessagesSection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const PartnersSection = lazy(() => import("@/components/PartnersSection"));

const Index = () => {
  return (
    <div className="overflow-x-hidden selection:bg-secondary selection:text-primary">
      <ScrollProgress />
      <CursorTrail />
      <FloatingActions />
      <Navbar />
      <HeroSection />

      <Suspense fallback={<ShimmerLoader />}>
        <div id="about">
          <AboutSection />
        </div>
        <StatsSection />
        <MessagesSection />
        <ObjectivesSection />
        <ImpactSection />
        <SitesSection />
        <RitualsSection />
        <div id="actualites">
          <ActualitesSection />
        </div>
        <ProgramSection />
        <ConcoursCTASection />
        <VoteCTASection />
        <ParticipateSection />
        <VisitorsSection />
        <GallerySection />
        <PartnersSection />
        <ContactSection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Index;
