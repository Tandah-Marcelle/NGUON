import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./heritage/SectionHeading";
import { NdopTexture, TextileFrame, NAVY } from "./heritage/Motif";
import cultureCeremony from "@/assets/since.jpeg";
import palaceInterior from "@/assets/patrimoine.jpeg";
import apropos1 from "@/assets/apropos1.jpeg";
import apropos2 from "@/assets/apropos2.jpeg";
import apropos3 from "@/assets/apropos3.jpeg";
import { motion } from "framer-motion";
import { Sparkles, Award, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect, useMemo } from "react";

const PROTECTED_TERMS = ['Nguon', 'Sha’Pam', 'Ncharé Yen', 'Bamoun', 'Foumban', 'NGUON'];

const protectTerms = (text: string) => {
  let protectedText = text;
  PROTECTED_TERMS.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    protectedText = protectedText.replace(regex, `<span class="notranslate">${term}</span>`);
  });
  return protectedText;
};

import { useTranslate } from "@/hooks/useTranslate";

const TranslatedParagraph = ({ text, className, delay }: { text: string; className?: string; delay?: number }) => {
  const protected_ = useMemo(() => protectTerms(text), [text]);
  const { translatedText } = useTranslate(protected_);
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay }}
      className={className}
      dangerouslySetInnerHTML={{ __html: translatedText }}
    />
  );
};

const TranslatedListItem = ({ item, i }: { item: string; i: number }) => {
  const protected_ = useMemo(() => protectTerms(item), [item]);
  const { translatedText } = useTranslate(protected_);
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="flex items-start gap-3 py-2.5 border-b border-foreground/10 last:border-b-0"
    >
      <span className="w-2 h-2 rotate-45 bg-secondary mt-2.5 flex-shrink-0" />
      <span className="text-foreground/80 font-body text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: translatedText }} />
    </motion.div>
  );
};

const AboutSection = () => {
  const { t } = useTranslation();
  const [firstImageIndex, setFirstImageIndex] = useState(0);
  const [secondImageIndex, setSecondImageIndex] = useState(0);

  const firstImages = [cultureCeremony, apropos2, apropos3];
  const secondImages = [palaceInterior, apropos1, apropos3];

  useEffect(() => {
    const interval1 = setInterval(() => {
      setFirstImageIndex((prev) => (prev + 1) % firstImages.length);
    }, 6000);

    let interval2: ReturnType<typeof setInterval>;
    const timeout1 = setTimeout(() => {
      interval2 = setInterval(() => {
        setSecondImageIndex((prev) => (prev + 1) % secondImages.length);
      }, 6000);
    }, 3000);

    return () => {
      clearInterval(interval1);
      clearTimeout(timeout1);
      clearInterval(interval2);
    };
  }, []);

  const pillars = [
    { icon: Sparkles, title: t('about.cards.tradition.title'), desc: t('about.cards.tradition.desc') },
    { icon: Award, title: t('about.cards.heritage.title'), desc: t('about.cards.heritage.desc') },
    { icon: Users, title: t('about.cards.community.title'), desc: t('about.cards.community.desc') },
  ];

  return (
    <section id="about" className="section-padding bg-paper overflow-hidden relative">
      <NdopTexture color={NAVY} opacity={0.05} fade="right" className="dark:hidden" />

      <div className="container mx-auto relative z-10">
        <SectionHeading
          title={<Trans i18nKey="about.title" components={{ 0: <span className="text-primary" /> }} />}
          lead={t('about.subtitle')}
        />

        {/* Three pillars, read as one line rather than three boxes */}
        <ul className="grid sm:grid-cols-3 border-y border-foreground/10 mb-16 md:mb-24">
          {pillars.map((item, i) => (
            <li
              key={item.title}
              className={`flex items-center gap-4 py-5 sm:py-7 sm:px-6 ${i > 0 ? "border-t sm:border-t-0 sm:border-l border-foreground/10" : "sm:pl-0"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-display text-base font-black text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-20 md:mb-28">
          <AnimatedSection direction="left">
            <TextileFrame side="left">
            <div className="relative h-[340px] sm:h-[420px] lg:h-[460px] group bg-muted">
              <motion.img
                key={firstImageIndex}
                src={firstImages[firstImageIndex]}
                alt=""
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute bottom-3 right-3 flex gap-2 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
                <button
                  aria-label="Image précédente"
                  onClick={() => setFirstImageIndex((firstImageIndex - 1 + firstImages.length) % firstImages.length)}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-navy" />
                </button>
                <button
                  aria-label="Image suivante"
                  onClick={() => setFirstImageIndex((firstImageIndex + 1) % firstImages.length)}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-navy" />
                </button>
              </div>
            </div>
            </TextileFrame>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.15}>
            <div className="space-y-6">
              <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-foreground leading-tight text-balance">
                {t('about.institution.title')}
              </h3>
              <div className="space-y-4 max-w-[62ch]">
                {[
                  t('about.institution.p1'),
                  t('about.institution.p2'),
                  t('about.institution.p3')
                ].map((text, i) => (
                  <TranslatedParagraph
                    key={i}
                    text={text}
                    className="text-foreground/75 font-body leading-relaxed text-base"
                    delay={i * 0.08}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Recognition Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection direction="left" className="order-2 md:order-1">
            <div className="space-y-5">
              <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-black text-foreground leading-tight text-balance">
                {t('about.recognition.title')}
              </h3>
              <div>
                {(t('about.recognition.items', { returnObjects: true }) as string[]).map((item, i) => (
                  <TranslatedListItem key={i} item={item} i={i} />
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.15} className="order-1 md:order-2">
            <TextileFrame side="right">
            <div className="relative h-[340px] sm:h-[420px] lg:h-[460px] group bg-muted">
              <motion.img
                key={secondImageIndex}
                src={secondImages[secondImageIndex]}
                alt=""
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
              <div className="absolute bottom-3 right-3 flex gap-2 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity">
                <button
                  aria-label="Image précédente"
                  onClick={() => setSecondImageIndex((secondImageIndex - 1 + secondImages.length) % secondImages.length)}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 text-navy" />
                </button>
                <button
                  aria-label="Image suivante"
                  onClick={() => setSecondImageIndex((secondImageIndex + 1) % secondImages.length)}
                  className="w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5 text-navy" />
                </button>
              </div>
            </div>
            </TextileFrame>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
