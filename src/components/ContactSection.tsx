import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import planeAnimation from "@/assets/Plane.json";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding hero-gradient overflow-hidden relative">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle at 30% 70%, hsl(48 100% 50% / 0.3) 0%, transparent 50%)`
      }} />

      {/* Plane Lottie Animation - Travel/Connection */}
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        whileInView={{ opacity: 0.2, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute bottom-10 left-0 w-80 h-80 pointer-events-none z-0"
      >
        <LottieAnimation
          animationData={planeAnimation}
          loop={true}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.2em] mb-3">Nous écrire</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Contact
          </h2>
          <div className="gold-line" />
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <AnimatedSection direction="left">
            <div className="space-y-8">
              <div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-4">Contact général</h3>
                <a
                  href="mailto:contact@nguonevent.com"
                  className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors font-body"
                >
                  <Mail className="w-5 h-5 text-secondary" />
                  contact@nguonevent.com
                </a>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-4">
                  Partenariats & Sponsoring
                </h3>
                <a
                  href="mailto:Nguon2026@orahagency.com"
                  className="flex items-center gap-3 text-primary-foreground/80 hover:text-secondary transition-colors font-body"
                >
                  <Mail className="w-5 h-5 text-secondary" />
                  Nguon2026@orahagency.com
                </a>
              </div>
              <div>
                <div className="flex items-center gap-3 text-primary-foreground/80 font-body">
                  <MapPin className="w-5 h-5 text-secondary" />
                  Foumban, Département du Noun, Cameroun
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2}>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 bg-primary-foreground/5 border border-primary-foreground/20 rounded-lg text-primary-foreground font-body placeholder:text-primary-foreground/40 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-3 bg-primary-foreground/5 border border-primary-foreground/20 rounded-lg text-primary-foreground font-body placeholder:text-primary-foreground/40 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
              <div>
                <textarea
                  rows={4}
                  placeholder="Votre message"
                  className="w-full px-4 py-3 bg-primary-foreground/5 border border-primary-foreground/20 rounded-lg text-primary-foreground font-body placeholder:text-primary-foreground/40 focus:outline-none focus:border-secondary transition-colors resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full gold-gradient text-foreground font-body font-semibold py-3 rounded-lg"
              >
                Envoyer le message
              </motion.button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
