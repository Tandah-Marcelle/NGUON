import AnimatedSection from "./AnimatedSection";
import cultureCeremony from "@/assets/since.jpeg";
import palaceInterior from "@/assets/patrimoine.jpeg";
import apropos1 from "@/assets/apropos1.jpeg";
import apropos2 from "@/assets/apropos2.jpeg";
import apropos3 from "@/assets/apropos3.jpeg";
import { motion } from "framer-motion";
import { Sparkles, Award, Users, ChevronLeft, ChevronRight } from "lucide-react";
import LottieAnimation from "./LottieAnimation";
import aiFlowAnimation from "@/assets/ai animation Flow 1.json";
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
      whileHover={{ x: 8, backgroundColor: "hsl(var(--secondary) / 0.05)" }}
      className="flex items-start gap-3 p-3 rounded-lg transition-colors"
    >
      <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
      <span className="text-muted-foreground font-body text-base" dangerouslySetInnerHTML={{ __html: translatedText }} />
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

  return (
    <section id="about" className="section-padding bg-gradient-to-b from-background via-cream/30 to-background overflow-hidden relative">
      {/* Soft decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      {/* AI Flow Lottie Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.08, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full pointer-events-none z-0"
      >
        <LottieAnimation
          animationData={aiFlowAnimation}
          loop={true}
        />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <AnimatedSection className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold"
          >
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
          >
            <Trans i18nKey="about.title" components={{ 0: <span className="text-primary" /> }} />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground font-body text-lg max-w-3xl mx-auto leading-relaxed"
          >
            {t('about.subtitle')}
          </motion.p>
        </AnimatedSection>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Sparkles, title: t('about.cards.tradition.title'), desc: t('about.cards.tradition.desc') },
            { icon: Award, title: t('about.cards.heritage.title'), desc: t('about.cards.heritage.desc') },
            { icon: Users, title: t('about.cards.community.title'), desc: t('about.cards.community.desc') },
          ].map((item, i) => (
            <AnimatedSection key={item.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="group bg-white border-4 border-primary rounded-2xl p-6 shadow-sm text-center hover:bg-primary shadow-md  transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-primary group-hover:bg-white/20 flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <item.icon className="w-7 h-7 text-white group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display text-lg font-bold text-primary group-hover:text-white mb-2 transition-colors duration-300">{item.title}</h3>
                <p className="text-primary group-hover:text-white font-body text-sm transition-colors duration-300">{item.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <AnimatedSection direction="left">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[450px] group">
              <motion.img
                key={firstImageIndex}
                src={firstImages[firstImageIndex]}
                alt="À propos"
                className="w-full h-full object-cover"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <button
                onClick={() => setFirstImageIndex((firstImageIndex - 1 + firstImages.length) % firstImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
              <button
                onClick={() => setFirstImageIndex((firstImageIndex + 1) % firstImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2}>
            <div className="space-y-6">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t('about.institution.title')}
              </h3>
              <div className="w-20 h-1 bg-primary rounded-full" />
              <div className="space-y-4">
                {[
                  t('about.institution.p1'),
                  t('about.institution.p2'),
                  t('about.institution.p3')
                ].map((text, i) => (
                  <TranslatedParagraph
                    key={i}
                    text={text}
                    className="text-muted-foreground font-body leading-relaxed text-base"
                    delay={i * 0.1}
                  />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Recognition Section */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <AnimatedSection direction="left" className="order-2 md:order-1">
            <div className="space-y-6">
              <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {t('about.recognition.title')}
              </h3>
              <div className="w-20 h-1 bg-primary rounded-full" />
              <div className="space-y-3">
                {(t('about.recognition.items', { returnObjects: true }) as string[]).map((item, i) => (
                  <TranslatedListItem key={i} item={item} i={i} />
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection direction="right" delay={0.2} className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[450px] group">
              <motion.img
                key={secondImageIndex}
                src={secondImages[secondImageIndex]}
                alt="À propos"
                className="w-full h-full object-cover"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <button
                onClick={() => setSecondImageIndex((secondImageIndex - 1 + secondImages.length) % secondImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
              <button
                onClick={() => setSecondImageIndex((secondImageIndex + 1) % secondImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
