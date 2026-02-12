import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import planeAnimation from "@/assets/Plane.json";

const ContactSection = () => {
  return (
    <section id="contact" className="section-padding bg-primary dark:bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background/5 to-primary/10 dark:from-background dark:via-primary/5 dark:to-background animate-pulse-glow opacity-50" />
      {/* Soft decorative elements */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-16">
          <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">Nous écrire</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white dark:text-foreground mb-6">
            Contact
          </h2>
          <p className="text-white/90 dark:text-muted-foreground font-body text-lg max-w-2xl mx-auto">
            Nous sommes à votre écoute pour toute question ou partenariat
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimatedSection direction="left">
            <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">Informations de contact</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">Contact général</h4>
                  <a
                    href="mailto:contact@nguonevent.com"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    contact@nguonevent.com
                  </a>
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground mb-3">
                    Partenariats & Sponsoring
                  </h4>
                  <a
                    href="mailto:Nguon2026@orahagency.com"
                    className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors font-body"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    Nguon2026@orahagency.com
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-3 text-muted-foreground font-body">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    Foumban, Département du Noun, Cameroun
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.2}>
            <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-6">Envoyez-nous un message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows={5}
                    placeholder="Votre message"
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-card transition-all resize-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-body font-semibold py-3 rounded-xl transition-all"
                >
                  Envoyer le message
                </motion.button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
