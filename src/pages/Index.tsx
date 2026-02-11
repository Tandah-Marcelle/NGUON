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
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CursorGlow from "@/components/CursorGlow";

const Index = () => {
  return (
    <div className="overflow-x-hidden">
      <CursorGlow />
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
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
