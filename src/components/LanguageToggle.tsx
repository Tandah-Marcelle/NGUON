
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
    const { i18n } = useTranslation();
    const [lang, setLang] = useState<"en" | "fr">("en");

    useEffect(() => {
        // Sync state with i18n language
        if (i18n.language) {
            const currentLang = i18n.language.startsWith('fr') ? 'fr' : 'en';
            setLang(currentLang);
        }
    }, [i18n.language]);

    const toggleLanguage = () => {
        const newLang = lang === "en" ? "fr" : "en";
        setLang(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors font-bold text-sm"
            aria-label="Toggle language"
        >
            <motion.span
                key={lang}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
            >
                {lang.toUpperCase()}
            </motion.span>
        </motion.button>
    );
}
