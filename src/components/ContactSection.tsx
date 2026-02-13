import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import LottieAnimation from "./LottieAnimation";
import planeAnimation from "@/assets/Plane.json";
import { toast } from "sonner";
import { api } from "@/lib/api";

import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('/contacts', formData);
      setIsSuccess(true);
      toast.success(t('contact.form.success') || 'Message envoyé avec succès!');
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      toast.error(t('contact.form.error') || 'Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section id="contact" className="section-padding bg-[#003B5C] dark:bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#002B44] via-[#003B5C] to-[#004B6E] opacity-100" />

      {/* Subtle decorative glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-72 h-72 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">

          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-12">
            <AnimatedSection direction="left">
              <div className="space-y-10">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white mb-4">{t('contact.general')}</h3>
                  <a
                    href="mailto:contact@nguonevent.com"
                    className="flex items-center gap-4 text-white/80 hover:text-secondary transition-all group lg:text-lg"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:bg-secondary/20 group-hover:border-secondary/30">
                      <Mail className="w-5 h-5 text-secondary" />
                    </div>
                    contact@nguonevent.com
                  </a>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-bold text-white mb-4">
                    {t('contact.partnerships')}
                  </h3>
                  <a
                    href="mailto:Nguon2026@orahagency.com"
                    className="flex items-center gap-4 text-white/80 hover:text-secondary transition-all group lg:text-lg"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-colors group-hover:bg-secondary/20 group-hover:border-secondary/30">
                      <Mail className="w-5 h-5 text-secondary" />
                    </div>
                    Nguon2026@orahagency.com
                  </a>
                </div>

                <div className="flex items-center gap-4 text-white/80 lg:text-lg pt-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  Foumban, Département du Noun, Cameroun
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <AnimatedSection direction="right" delay={0.2}>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('contact.form.name')}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-body placeholder:text-white/40 focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t('contact.form.email')}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-body placeholder:text-white/40 focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <div>
                  <textarea
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.form.message')}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-body placeholder:text-white/40 focus:outline-none focus:border-secondary/50 focus:bg-white/10 transition-all resize-none"
                  />
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#FFC107" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading || isSuccess}
                    type="submit"
                    className="w-full bg-secondary text-primary font-display font-bold text-lg py-5 rounded-xl transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-4 border-dashed border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : isSuccess ? (
                      <>
                        <Check size={20} />
                        {t('contact.form.success') || 'Message envoyé!'}
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        {t('contact.form.submit')}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </AnimatedSection>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
