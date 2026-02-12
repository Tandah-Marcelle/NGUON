import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import ObjectivesSection from "@/components/ObjectivesSection";
import SitesSection from "@/components/SitesSection";
import RitualsSection from "@/components/RitualsSection";
import ImpactSection from "@/components/ImpactSection";
import ParticipateSection from "@/components/ParticipateSection";
import GallerySection from "@/components/GallerySection";
import VisitorsSection from "@/components/VisitorsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CursorTrail from "@/components/CursorTrail";
import ScrollProgress from "@/components/ScrollProgress";
import FloatingActions from "@/components/FloatingActions";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <ScrollProgress />
      <CursorTrail />
      <FloatingActions />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ObjectivesSection />
      <SitesSection />
      <RitualsSection />
      <ImpactSection />
      <ParticipateSection />
      <GallerySection />
      <VisitorsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
