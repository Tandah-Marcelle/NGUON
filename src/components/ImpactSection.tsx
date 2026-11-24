import { motion } from "framer-motion";
import { Palette, TrendingUp, Users, MapPin } from "lucide-react";
import SectionHeading from "./heritage/SectionHeading";
import { useTranslation, Trans } from "react-i18next";

const impacts = [
  {
    icon: Palette,
    title: "impact.items.cultural.title",
    items: "impact.items.cultural.items",
  },
  {
    icon: TrendingUp,
    title: "impact.items.economic.title",
    items: "impact.items.economic.items",
  },
  {
    icon: Users,
    title: "impact.items.social.title",
    items: "impact.items.social.items",
  },
  {
    icon: MapPin,
    title: "impact.items.territorial.title",
    items: "impact.items.territorial.items",
  },
];

const ImpactSection = () => {
  const { t } = useTranslation();
  return (
    <section id="impact" className="section-padding bg-paper overflow-hidden relative">
      <div className="container mx-auto relative z-10">
        <SectionHeading
          title={<Trans i18nKey="impact.title" components={{ 0: <span className="text-primary" /> }} />}
          lead={t('impact.description')}
        />

        <div className="grid md:grid-cols-2 border-t border-foreground/10">
          {impacts.map((impact, i) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`py-8 md:py-10 border-b border-foreground/10 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12 md:border-l"}`}
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                  <impact.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-black text-foreground">{t(impact.title)}</h3>
              </div>
              <ul className="space-y-3">
                {(t(impact.items, { returnObjects: true }) as string[]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-foreground/75 font-body text-[15px] leading-relaxed">
                    <span className="w-2 h-2 rotate-45 bg-secondary mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
