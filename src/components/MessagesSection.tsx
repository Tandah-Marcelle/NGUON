import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import majesty from "@/assets/majesty.jpg";
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
                const published = data.filter((msg: any) => msg.published !== false);
                // Keep only the Sultan's message (usually the first one)
                setMessages(published.slice(0, 1));
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };
        loadMessages();
    }, []);

    if (messages.length === 0) {
        return null;
    }

    return (
        <section className="pt-24 pb-8 bg-white dark:bg-background overflow-hidden relative">
            <div className="container mx-auto px-4">
                {messages.map((message) => (
                    <div key={message.id} className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative order-2 lg:order-1">
                            <AnimatedSection direction="left">
                                <div className="relative w-full max-w-[500px] aspect-square mx-auto">
                                    <div className="absolute inset-0 rounded-full border-[12px] border-primary/5 p-4 z-10">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                            <img
                                                src={majesty}
                                                alt={t('messages.sultan.full_name')}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -inset-8 bg-primary/5 rounded-full -z-1" />
                                </div>
                            </AnimatedSection>
                        </div>
                        <div className="order-1 lg:order-2">
                            <AnimatedSection direction="right">
                                <p className="text-secondary font-body text-sm uppercase tracking-[0.3em] mb-4 font-semibold">{t('messages.sultan.honor_word')}</p>
                                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                                    <Trans
                                        i18nKey="messages.sultan.message_title"
                                        components={{ 0: <span className="text-primary" /> }}
                                    />
                                </h2>
                                <div className="space-y-6 text-muted-foreground font-body text-lg leading-relaxed">
                                    <p className="whitespace-pre-wrap">"{message.content}"</p>
                                    <div className="pt-4">
                                        <p className="font-display font-bold text-foreground text-xl">
                                            {t('messages.sultan.full_name')}
                                        </p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MessagesSection;
