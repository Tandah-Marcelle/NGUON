import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageToggle({ scrolled = false }: { scrolled?: boolean }) {
    const { i18n } = useTranslation();
    const [lang, setLang] = useState<"en" | "fr">("en");

    useEffect(() => {
        if (i18n.language) {
            const currentLang = i18n.language.startsWith('fr') ? 'fr' : 'en';
            setLang(currentLang);
        }
    }, [i18n.language]);

    const changeLanguage = (newLang: "en" | "fr") => {
        setLang(newLang);
        i18n.changeLanguage(newLang);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 ${
                        scrolled
                            ? "text-foreground/70 hover:text-primary hover:bg-primary/10"
                            : "text-white hover:text-white/80 hover:bg-white/10 dark:text-foreground/70 dark:hover:text-primary dark:hover:bg-primary/10"
                    }`}
                >
                    <Globe size={18} />
                    <span className="hidden sm:inline-block">
                        {lang === "en" ? "English" : "Français"}
                    </span>
                    <ChevronDown size={14} className="opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage("en")} className="flex items-center justify-between gap-4">
                    <span>English</span>
                    {lang === "en" && <Check size={14} />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage("fr")} className="flex items-center justify-between gap-4">
                    <span>Français</span>
                    {lang === "fr" && <Check size={14} />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
