import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import logo2 from "@/assets/logo2.png";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
];

import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-background py-16 px-4 relative overflow-hidden border-t border-border">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="mb-6">
              <img src={logo2} alt="Le Nguon Logo" className="h-16 w-auto" />
            </div>
            <p className="text-foreground/70 font-body text-sm leading-relaxed mb-6 max-w-md">
              {t('footer.description')}
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  whileHover={{ scale: 1.2, y: -5 }}
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center text-primary hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-display text-lg font-bold text-foreground mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              {["Accueil", "À Propos", "Sites", "Programme", "Participer", "Contact"].map((link, i) => (
                <motion.li
                  key={link}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                >
                  <a
                    href={`#${link.toLowerCase().replace(/\s/g, "").replace("àpropos", "about")}`}
                    className="text-foreground/60 hover:text-primary font-body text-sm transition-colors inline-block group"
                  >
                    <span className="relative">
                      {t(`nav.${link.toLowerCase().replace(/\s/g, "").replace("àpropos", "about")}`)}
                      <motion.span
                        className="absolute -bottom-0.5 left-0 h-px bg-primary"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-display text-lg font-bold text-foreground mb-4">{t('footer.contact_title')}</h4>
            <ul className="space-y-3">
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="flex items-start gap-3 text-foreground/60 font-body text-sm"
              >
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <span>Foumban, Région de l'Ouest, Cameroun</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="flex items-center gap-3 text-foreground/60 font-body text-sm"
              >
                <Mail size={16} className="text-primary flex-shrink-0" />
                <a href="mailto:contact@nguon.cm" className="hover:text-primary transition-colors">
                  contact@nguon.cm
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-center gap-3 text-foreground/60 font-body text-sm"
              >
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span>+237 XXX XXX XXX</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="gold-line my-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          style={{ background: "linear-gradient(90deg, hsl(201 100% 35%), hsl(48 100% 50%))" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <p className="text-foreground/50 font-body text-xs">
            {t('footer.copyright')}
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-foreground/40 font-body text-xs mt-2"
          >
            {t('footer.rights')}
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
