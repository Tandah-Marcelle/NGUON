import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import AnimatedSection from "./AnimatedSection";
import majesty from "@/assets/roiphoto.jpeg"
import { Quote } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { api } from "@/lib/api";

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

const MessageItem = ({ message }: { message: any }) => {
    const { t } = useTranslation();
    const { translatedText: content } = useTranslate(protectTerms(message.content));
    const { translatedText: fullName } = useTranslate(protectTerms(t('messages.sultan.full_name')));

    return (
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
                <AnimatedSection direction="left">
                    <div className="relative w-full max-w-[500px] aspect-square mx-auto">
                        <div className="absolute inset-0 rounded-full border-[12px] border-primary/5 p-4 z-10">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                <img
                                    src={majesty}
                                    alt={fullName}
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
                        <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: `"${content}"` }} />
                        <div className="pt-4">
                            <p className="font-display font-bold text-foreground text-xl" dangerouslySetInnerHTML={{ __html: fullName }} />
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

const MessagesSection = () => {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const data = await api.getMessages();
                const published = data.filter((msg: any) => msg.published !== false);
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
                    <MessageItem key={message.id} message={message} />
                ))}
            </div>
        </section>
    );
};

export default MessagesSection;
