import { motion } from "framer-motion";
import { Eye, Zap, Globe, Heart, Handshake, Award, Users, Store, ArrowRight } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./heritage/SectionHeading";
import { TextileFrame } from "./heritage/Motif";
import bg3 from "@/assets/culture-ceremony.jpg";
import { useTranslation, Trans } from "react-i18next";

const reasonIcons = [Eye, Zap, Globe, Heart, Handshake];

const participationTypes = [
  { type: "participate.types.sponsor.type", desc: "participate.types.sponsor.desc", icon: Award },
  { type: "participate.types.partner.type", desc: "participate.types.partner.desc", icon: Users },
  { type: "participate.types.exhibitor.type", desc: "participate.types.exhibitor.desc", icon: Store },
];

const ParticipateSection = () => {
  const { t } = useTranslation();
  const reasons = (t('participate.reasons', { returnObjects: true }) as string[]).map((text, i) => ({
    icon: reasonIcons[i],
    text
  }));
  return (
    <section id="participer" className="section-padding bg-background relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 lg:gap-20 items-center mb-16 md:mb-24">
          <div>
            <SectionHeading
              align="left"
              className="mb-8 md:mb-10"
              title={<Trans i18nKey="participate.title" components={{ 0: <span className="text-primary" /> }} />}
              lead={t('participate.description')}
            />
            <ul className="border-t border-foreground/10">
              {reasons.map((r, i) => (
                <motion.li
                  key={r.text}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-4 py-3.5 border-b border-foreground/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                    {r.icon && <r.icon className="w-[18px] h-[18px] text-secondary" />}
                  </div>
                  <p className="text-foreground/85 font-body text-[15px]">{r.text}</p>
                </motion.li>
              ))}
            </ul>
          </div>
          <AnimatedSection direction="right">
            <TextileFrame side="right">
              <img src={bg3} alt="" loading="lazy" className="w-full h-[320px] md:h-[440px] object-cover" />
            </TextileFrame>
          </AnimatedSection>
        </div>

        {/* Ways to take part */}
        <div className="grid md:grid-cols-3 border-y border-foreground/10">
          {participationTypes.map(({ type, desc, icon: Icon }, i) => (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className={`py-8 md:py-10 md:px-8 ${i > 0 ? "border-t md:border-t-0 md:border-l border-foreground/10" : "md:pl-0"}`}
            >
              <Icon className="w-8 h-8 text-primary mb-5" strokeWidth={1.6} />
              <h3 className="font-display text-2xl font-black text-foreground mb-2">{t(type)}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{t(desc)}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2.5 rounded-2xl bg-navy px-7 py-4 font-display text-sm font-black text-white shadow-[0_12px_28px_-14px_rgba(0,30,50,0.6)] transition hover:bg-navy-deep active:scale-[0.98]"
          >
            {t('participate.contact_cta')} <ArrowRight size={16} className="text-secondary" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ParticipateSection;
