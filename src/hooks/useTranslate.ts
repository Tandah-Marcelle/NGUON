import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../lib/google-translate';

// Kill switch for the on-the-fly Google Translate layer. Flip back to true
// once a working VITE_GOOGLE_TRANSLATE_API_KEY is deployed — until then this
// hook is a pure passthrough (no network calls, no async work at all), so it
// can never be a factor in a blank page or any other app-level failure.
const TRANSLATION_ENABLED = false;

// Module-level cache: lang -> text -> translated
const cache = new Map<string, string>();

export const useTranslate = (text: string) => {
    const { i18n } = useTranslation();
    const [translatedText, setTranslatedText] = useState(text);
    const [isLoading, setIsLoading] = useState(false);
    const prevRef = useRef<{ text: string; lang: string } | null>(null);

    useEffect(() => {
        if (!TRANSLATION_ENABLED) {
            setTranslatedText(text);
            return;
        }

        const targetLang = i18n.language.split('-')[0];

        // Skip if nothing changed
        if (prevRef.current?.text === text && prevRef.current?.lang === targetLang) return;
        prevRef.current = { text, lang: targetLang };

        if (!text || targetLang === 'fr') {
            setTranslatedText(text);
            return;
        }

        const cacheKey = `${targetLang}::${text}`;
        if (cache.has(cacheKey)) {
            setTranslatedText(cache.get(cacheKey)!);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        translateText(text, targetLang)
            .then((result) => {
                if (cancelled) return;
                cache.set(cacheKey, result);
                setTranslatedText(result);
            })
            .catch(() => {
                if (!cancelled) setTranslatedText(text);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [text, i18n.language]);

    return { translatedText, isLoading };
};
