import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import majesty from "@/assets/majesty.jpg";
import palaceInterior from "@/assets/palace-interior.jpg";
import { Quote } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { api } from "@/lib/api";

const MessagesSection = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = await api.getMessages();
                const published = data.filter((msg: any) => msg.published);
                setMessages(published);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };
        loadMessages();
    }, []);

    if (messages.length === 0) {
        return null; // Don't render section if no published messages
    }
    return (
        <section className="py-24 bg-white dark:bg-background overflow-hidden relative">
            <div className="container mx-auto px-4">
                {messages.map((message, index) => (
                    <div key={message.id} className={`grid lg:grid-cols-2 gap-16 items-center ${index < messages.length - 1 ? 'mb-32' : ''}`}>
                        {index % 2 === 0 ? (
                            <>
                                <div className="relative order-2 lg:order-1">
                                    <AnimatedSection direction="left">
                                        <div className="relative w-full max-w-[500px] aspect-square mx-auto">
                                            <div className="absolute inset-0 rounded-full border-[12px] border-primary/5 p-4 z-10">
                                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                                    <img
                                                        src={majesty}
                                                        alt={message.authorityTitle}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ y: [0, -15, 0] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute -top-4 -left-12 md:-left-20 z-20 bg-white/80 dark:bg-card/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl shadow-xl border border-primary/10 max-w-[280px]"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <Quote size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-display font-bold text-foreground text-sm">{message.authorityTitle}</p>
                                                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider">{t('messages.sultan.title')}</p>
                                                    </div>
                                                </div>
                                                <p className="mt-3 font-body text-xs italic text-foreground/80 leading-relaxed">
                                                    "{t('messages.sultan.quote_bubble')}"
                                                </p>
                                            </motion.div>

                                            <motion.div
                                                animate={{ y: [0, 12, 0] }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                className="absolute bottom-12 -right-8 md:-right-16 z-20 bg-primary text-white p-4 md:p-6 rounded-2xl shadow-2xl border border-secondary/20 max-w-[240px]"
                                            >
                                                <p className="font-display font-bold text-secondary text-base mb-1">{t('messages.sultan.tradition_modernity')}</p>
                                                <p className="font-body text-xs text-white/90 leading-relaxed">
                                                    {t('messages.sultan.legacy')}
                                                </p>
                                            </motion.div>
                                            <div className="absolute -inset-8 bg-primary/5 rounded-full -z-1" />
                                        </div>
                                    </AnimatedSection>
                                </div>
                                <div className="order-1 lg:order-2">
                                    <AnimatedSection direction="right">
                                        <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">{t('messages.sultan.honor_word')}</p>
                                        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                                            {message.authorityTitle}
                                        </h2>
                                        <div className="space-y-6 text-muted-foreground font-body text-lg leading-relaxed">
                                            <p className="whitespace-pre-wrap">"{message.content}"</p>
                                            <div className="pt-4">
                                                <p className="font-display font-bold text-foreground text-xl">{message.authorityTitle}</p>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <AnimatedSection direction="left">
                                        <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">{t('messages.coordinator.organization')}</p>
                                        <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                                            {message.authorityTitle}
                                        </h2>
                                        <div className="space-y-6 text-muted-foreground font-body text-lg leading-relaxed">
                                            <p className="whitespace-pre-wrap">"{message.content}"</p>
                                            <div className="pt-4">
                                                <p className="font-display font-bold text-foreground text-xl">{message.authorityTitle}</p>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                </div>
                                <div className="relative">
                                    <AnimatedSection direction="right">
                                        <div className="relative group overflow-hidden rounded-[2.5rem] bg-warm-white p-2">
                                            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-xl">
                                                <img
                                                    src={palaceInterior}
                                                    alt={message.authorityTitle}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                                            </div>
                                            <div className="absolute -bottom-6 -left-6 bg-secondary p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                                                <p className="text-primary font-display font-bold text-2xl">{t('messages.coordinator.vision')}</p>
                                                <p className="text-primary/70 font-body text-xs font-semibold">{t('messages.coordinator.excellence')}</p>
                                            </div>
                                        </div>
                                    </AnimatedSection>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MessagesSection;
