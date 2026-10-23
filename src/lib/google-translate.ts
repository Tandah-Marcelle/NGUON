const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;
const API_URL = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

// Once the key proves unusable (missing, revoked, disabled…), stop hitting
// Google entirely for the rest of the session — without this, every piece of
// translatable text on every page keeps retrying the same dead key forever,
// spamming the API and the console for no benefit. The app always has the
// original (default-language) text to fall back to, so this only turns off
// the on-the-fly translation layer, never the page content itself.
let translationUnavailable = !API_KEY;

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    if (!text || !targetLanguage) return text;
    if (translationUnavailable) return text;

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

        if (!response.ok) {
            // 4xx here is Google rejecting the key/project itself (invalid,
            // disabled, no billing…), not a one-off bad request — retrying
            // it per text block would just reproduce the same failure.
            if (response.status >= 400 && response.status < 500) translationUnavailable = true;
            console.error('Translation error:', await response.json().catch(() => response.statusText));
            return text;
        }

        const data = await response.json();

        if (data.data && data.data.translations && data.data.translations.length > 0) {
            return data.data.translations[0].translatedText;
        }

        console.error('Translation error:', data);
        return text;
    } catch (error) {
        console.error('Error calling Google Translate API:', error);
        return text;
    }
};
