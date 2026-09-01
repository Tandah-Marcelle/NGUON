import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import AnimatedSection from "./AnimatedSection";

const VoteCTASection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding relative overflow-hidden bg-[#003B5C]">
      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-secondary/50 to-transparent" />

      <div className="container mx-auto relative z-10">
        <AnimatedSection>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-5xl mx-auto text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                <Heart size={28} className="text-secondary" />
              </div>
              <div>
                <p className="text-secondary font-body text-xs font-black uppercase tracking-[0.3em] mb-2">{t("vote.eyebrow")}</p>
                <h2 className="font-display text-2xl md:text-3xl font-black text-white mb-2">
                  {t("vote.home_cta_title")}
                </h2>
                <p className="font-body text-white/60 text-sm md:text-base max-w-md">
                  {t("vote.home_cta_desc")}
                </p>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-shrink-0">
              <Link
                to="/concours#votes"
                className="inline-flex items-center gap-2.5 bg-secondary hover:bg-secondary/90 text-[#003B5C] font-display font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-secondary/30 transition-all whitespace-nowrap"
              >
                {t("vote.home_cta_button")} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default VoteCTASection;
