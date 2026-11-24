import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import AnimatedSection from "./AnimatedSection";
import { NdopTexture, GOLD } from "./heritage/Motif";
import majesty from "@/assets/roiphoto.jpeg"
import { Quote } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { api } from "@/lib/api";
import { useTranslate } from "@/hooks/useTranslate";

const PROTECTED_TERMS = ['Nguon', 'Sha’Pam', 'Ncharé Yen', 'Bamoun', 'Foumban', 'NGUON'];

const protectTerms = (text: string) => {
    let protectedText = text;
    PROTECTED_TERMS.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        protectedText = protectedText.replace(regex, `<span class="notranslate">${term}</span>`);
    });
    return protectedText;
};

const MessageItem = ({ message }: { message: any }) => {
    const { t } = useTranslation();
    const protectedContent = useMemo(() => protectTerms(message.content), [message.content]);
    const protectedTitle = useMemo(() => protectTerms(message.authorityTitle), [message.authorityTitle]);
    const { translatedText: content } = useTranslate(protectedContent);
    const { translatedText: authorityTitle } = useTranslate(protectedTitle);
    const { translatedText: signature } = useTranslate('Sa Majesté le Sultan, Mouhammad-Nabil MFORIFOUM MBOMBO NJOYA, Roi des Bamoun');

    return (
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-14 lg:gap-20 items-center">
            <AnimatedSection direction="left" className="order-2 lg:order-1">
                {/* Arched portrait, echoing the arcades of the royal palace at Foumban */}
                <div className="relative mx-auto w-full max-w-[420px]">
                    <div aria-hidden className="absolute -right-4 -bottom-4 w-3/4 h-3/4 rounded-2xl bg-navy overflow-hidden">
                        <NdopTexture color={GOLD} opacity={0.4} size={40} />
                    </div>
                    <div className="relative aspect-[4/5] rounded-t-[999px] rounded-b-2xl overflow-hidden ring-1 ring-black/5 shadow-[0_24px_50px_-22px_rgba(0,30,50,0.55)]">
                        <img src={majesty} alt={message.authorityTitle} className="w-full h-full object-cover object-top" />
                    </div>
                </div>
            </AnimatedSection>
            <AnimatedSection direction="right" className="order-1 lg:order-2">
                <Quote aria-hidden className="w-12 h-12 text-secondary mb-5" strokeWidth={1.5} />
                <h2
                    className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-8 leading-[1.08] tracking-tight text-balance"
                    dangerouslySetInnerHTML={{ __html: authorityTitle }}
                />
                <blockquote className="max-w-[62ch] text-foreground/80 font-body text-base md:text-lg leading-relaxed">
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                    <div className="h-px w-12 bg-secondary flex-shrink-0" />
                    <p className="font-display font-black text-foreground text-base md:text-lg">{signature}</p>
                </div>
            </AnimatedSection>
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
        <section className="py-20 md:py-28 bg-background overflow-hidden relative">
            <div className="container mx-auto px-4">
                {messages.map((message) => (
                    <MessageItem key={message.id} message={message} />
                ))}
            </div>
        </section>
    );
};

export default MessagesSection;
