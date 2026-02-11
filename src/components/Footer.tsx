import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-royal-dark py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl font-bold text-primary-foreground">
              <span className="text-secondary">LE</span> NGUON
            </h3>
            <p className="text-primary-foreground/50 font-body text-sm mt-1">
              Patrimoine culturel immatériel du Royaume Bamoun
            </p>
          </div>

          <div className="flex gap-8">
            {["Accueil", "À Propos", "Programme", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s/g, "").replace("àpropos", "about")}`}
                className="text-primary-foreground/60 hover:text-secondary font-body text-sm transition-colors animated-underline"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="gold-line my-8" />

        <div className="text-center">
          <p className="text-primary-foreground/40 font-body text-xs">
            © 2026 Le Nguon — Grandes Journées Traditionnelles, Culturelles et Économiques du peuple Bamoun
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
