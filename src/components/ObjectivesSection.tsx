import { motion } from "framer-motion";
import { Target, Heart, TrendingUp, BookOpen, Globe } from "lucide-react";
import dancePerformance from "@/assets/dance-performance.jpg";
import SectionHeading from "./heritage/SectionHeading";
import { NdopTexture } from "./heritage/Motif";
import { useTranslation, Trans } from "react-i18next";

const objectives = [
  {
    icon: Target,
    title: "objectives.items.governance.title",
    text: "objectives.items.governance.text",
  },
  {
    icon: Heart,
    title: "objectives.items.social_cohesion.title",
    text: "objectives.items.social_cohesion.text",
  },
  {
    icon: TrendingUp,
    title: "objectives.items.local_economy.title",
    text: "objectives.items.local_economy.text",
  },
  {
    icon: BookOpen,
    title: "objectives.items.transmission.title",
    text: "objectives.items.transmission.text",
  },
  {
    icon: Globe,
    title: "objectives.items.universal_heritage.title",
    text: "objectives.items.universal_heritage.text",
  },
];

const ObjectivesSection = () => {
  const { t } = useTranslation();
  return (
    <section id="objectives" className="relative overflow-hidden bg-navy text-white">
      {/* Photo fills the right half on desktop, a banner on top on mobile */}
      <div className="relative h-64 sm:h-80 lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[48%]">
        <img src={dancePerformance} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent lg:bg-gradient-to-r lg:from-navy lg:via-navy/40 lg:to-transparent" />
      </div>
      <NdopTexture opacity={0.06} fade="left" className="lg:right-[48%]" />

      <div className="container relative mx-auto px-4 md:px-8 py-16 md:py-20 lg:py-28">
        <div className="lg:w-[52%] lg:pr-16">
          <SectionHeading
            align="left"
            tone="light"
            title={<Trans i18nKey="objectives.title" components={{ 0: <span className="text-secondary" /> }} />}
            lead={t('objectives.description')}
          />

          <ul className="divide-y divide-white/10 border-y border-white/10">
            {objectives.map((obj, i) => (
              <motion.li
                key={obj.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-5 py-5"
              >
                <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-secondary/40 bg-secondary/10">
                  <obj.icon className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black">{t(obj.title)}</h3>
                  <p className="mt-1 font-body text-sm leading-relaxed text-white/75">{t(obj.text)}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;
