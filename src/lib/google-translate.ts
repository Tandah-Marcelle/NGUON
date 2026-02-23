const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const API_URL = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    if (!text || !targetLanguage) return text;

    // Basic optimization: if target is the same as source (assuming default is fr for now or detected)
    // Google API handles this, but saving a call if we can determine it.

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                target: targetLanguage,
                format: 'html' // Use html to respect tags like <span class="notranslate">
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.data && data.data.translations && data.data.translations.length > 0) {
            const translated = data.data.translations[0].translatedText;
            console.log(`%c[Google Translate] Success!`, "color: #10b981; font-weight: bold; padding: 2px 4px; background: rgba(16, 185, 129, 0.1); border-radius: 4px;", {
                original: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
                translated: translated.substring(0, 50) + (translated.length > 50 ? '...' : ''),
                lang: targetLanguage
            });
            return translated;
        }

        console.error('Translation error:', data);
        return text;
    } catch (error) {
        console.error('Error calling Google Translate API:', error);
        return text;
    }
};
