import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateText } from '../lib/google-translate';

export const useTranslate = (text: string) => {
    const { i18n } = useTranslation();
    const [translatedText, setTranslatedText] = useState(text);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const performTranslation = async () => {
            // Don't translate if text is empty or language is French (assuming source is French)
            // or if language hasn't changed from default.
            // But more safely, we translate whenever i18n.language changes if it's not 'fr'

            const targetLang = i18n.language.split('-')[0]; // get 'en' from 'en-US'

            if (!text || targetLang === 'fr') {
                setTranslatedText(text);
                return;
            }

            setIsLoading(true);
            try {
                const result = await translateText(text, targetLang);
                setTranslatedText(result);
            } catch (error) {
                console.error('Translation hook error:', error);
                setTranslatedText(text);
            } finally {
                setIsLoading(false);
            }
        };

        performTranslation();
    }, [text, i18n.language]);

    return { translatedText, isLoading };
};
