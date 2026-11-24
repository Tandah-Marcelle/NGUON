import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import { NdopTexture, WovenBand, GOLD } from "./heritage/Motif";
import { useTranslation } from "react-i18next";

const stats = [
  { value: 10, suffix: "", label: "stats.items.days" },
  { value: 500, suffix: "K+", label: "stats.items.participants" },
  { value: 300, suffix: "+", label: "stats.items.actors" },
  { value: 60, suffix: "+", label: "stats.items.partners" },
  { value: 7, suffix: "+", label: "stats.items.sites" },
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl lg:text-[2.6rem] xl:text-5xl font-black text-secondary tabular-nums tracking-tight whitespace-nowrap">
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative bg-navy text-white overflow-hidden">
      <WovenBand color={GOLD} opacity={0.9} />
      <NdopTexture opacity={0.07} fade="edges" />

      <div className="container mx-auto px-4 md:px-8 relative py-14 md:py-20 lg:flex lg:items-center lg:gap-16">
        <AnimatedSection className="lg:w-64 flex-shrink-0 mb-10 lg:mb-0">
          <h2 className="font-display text-3xl md:text-4xl font-black leading-tight text-balance">{t('stats.title')}</h2>
          <div className="mt-4 h-1 w-14 bg-secondary rounded-full" />
        </AnimatedSection>

        <dl className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-y-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col-reverse justify-end px-4 md:px-5 ${i % 2 === 1 ? "border-l border-white/15" : ""} md:border-l md:border-white/15 ${i === 0 ? "md:border-l-0 md:pl-0" : ""}`}
            >
              <dt className="mt-2 text-sm text-white/75 font-body leading-snug">{t(stat.label)}</dt>
              <dd><Counter value={stat.value} suffix={stat.suffix} /></dd>
            </motion.div>
          ))}
        </dl>
      </div>

      <WovenBand color={GOLD} opacity={0.9} className="rotate-180" />
    </section>
  );
};

export default StatsSection;
