import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { WovenBand, GOLD } from "./heritage/Motif";
import logo2 from "@/assets/logo2.png";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61585842383451", label: "Facebook" },
];

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useTranslation();
  const links = [
    { label: "nav.home", href: "/#accueil" },
    { label: "nav.about", href: "/#about" },
    { label: "nav.sites_manifestations", href: "/#sites" },
    { label: "nav.program", href: "/#programme" },
    { label: "nav.participate", href: "/#participer" },
    { label: "nav.vote", href: "/vote" },
    { label: "nav.contact", href: "/#contact" },
  ];
  return (
    <footer className="bg-navy-deep text-white relative overflow-hidden">
      <div className="container mx-auto relative z-10 px-4 md:px-8 pt-16 pb-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="mb-6 inline-flex rounded-2xl bg-white p-2.5">
              <img src={logo2} alt="Le Nguon" className="h-14 w-auto" />
            </div>
            <p className="text-white/70 font-body text-sm leading-relaxed mb-6 max-w-md">{t('footer.description')}</p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/15 hover:border-secondary hover:bg-secondary hover:text-navy flex items-center justify-center text-white/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t('footer.navigation')}>
            <h4 className="font-display text-base font-black text-white mb-4">{t('footer.navigation')}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/65 hover:text-secondary font-body text-sm transition-colors underline-offset-4 hover:underline">
                    {t(link.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h4 className="font-display text-base font-black text-white mb-4">{t('footer.contact_title')}</h4>
            <ul className="space-y-3 text-white/65 font-body text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                <span>Foumban, Région de l'Ouest, Cameroun</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-secondary flex-shrink-0" />
                <a href="mailto:Contact@fondationnguon.org" className="hover:text-secondary transition-colors break-all">Contact@fondationnguon.org</a>
              </li>
              <li className="flex flex-col gap-2 pl-7">
                <a href="https://wa.me/237652482612" className="hover:text-secondary transition-colors flex items-center gap-2"><WhatsAppIcon /> +237 652 482 612</a>
                <a href="https://wa.me/237691769364" className="hover:text-secondary transition-colors flex items-center gap-2"><WhatsAppIcon /> +237 691 769 364</a>
                <a href="tel:+237622231854" className="hover:text-secondary transition-colors flex items-center gap-2"><Phone size={16} /> +237 622 231 854</a>
              </li>
            </ul>
          </div>
        </div>

        <WovenBand color={GOLD} opacity={0.35} className="mb-8" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-white/50 font-body text-xs">
          <p>{t('footer.copyright')}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/confidentialite" className="hover:text-secondary underline-offset-4 hover:underline">{t('footer.privacy')}</Link>
            <Link to="/conditions" className="hover:text-secondary underline-offset-4 hover:underline">{t('footer.terms')}</Link>
            <p>{t('footer.rights')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
