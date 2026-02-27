import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";
import logo2 from "@/assets/logo2.png";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61585842383451", label: "Facebook" },
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
              {[
                { label: "nav.home", href: "#accueil" },
                { label: "nav.about", href: "#about" },
                { label: "nav.sites_manifestations", href: "#sites" },
                { label: "nav.program", href: "#programme" },
                { label: "nav.participate", href: "#participer" },
                { label: "nav.contact", href: "#contact" }
              ].map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                >
                  <a
                    href={link.href}
                    className="text-foreground/60 hover:text-primary font-body text-sm transition-colors inline-block group"
                  >
                    <span className="relative">
                      {t(link.label)}
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
                <a href="mailto:Contact@fondationnguon.org" className="hover:text-primary transition-colors">
                  Contact@fondationnguon.org
                </a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex items-start gap-3 text-foreground/60 font-body text-sm"
              >
                {/* <Phone size={16} className="text-primary flex-shrink-0 mt-1" /> */}
                <div className="flex flex-col gap-1">
                  <a href="https://wa.me/237652482612" className="hover:text-primary transition-colors flex items-center gap-2">
                    <WhatsAppIcon /> +237 652 482 612
                  </a>
                  <a href="https://wa.me/237691769364" className="hover:text-primary transition-colors flex items-center gap-2">
                    <WhatsAppIcon /> +237 691 769 364
                  </a>
                  <a href="tel:+237622231854" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Phone size={16} /> +237 622 231 854
                  </a>
                </div>
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
