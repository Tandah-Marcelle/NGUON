import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { NdopTexture } from "@/components/heritage/Motif";
import { LEGAL_DOCS, LEGAL_UPDATED } from "@/content/legal";

type Kind = keyof typeof LEGAL_DOCS;

const OTHER: Record<Kind, { kind: Kind; path: string }> = {
  privacy: { kind: "terms", path: "/conditions" },
  terms: { kind: "privacy", path: "/confidentialite" },
};

export default function LegalPage({ kind }: { kind: Kind }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "fr";
  const doc = LEGAL_DOCS[kind][lang];
  const other = LEGAL_DOCS[OTHER[kind].kind][lang];

  useEffect(() => {
    document.title = `${doc.title} — Nguon`;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [doc.title]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <header className="relative overflow-hidden bg-navy text-white pt-32 pb-14 md:pt-40 md:pb-20">
        <NdopTexture opacity={0.07} fade="right" />
        <div className="container relative mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl md:text-5xl font-black leading-tight text-balance">{doc.title}</h1>
          <div className="mt-5 h-1 w-14 rounded-full bg-secondary" />
          <p className="mt-5 text-sm text-white/70">
            {lang === "fr" ? "Dernière mise à jour : " : "Last updated: "}
            {LEGAL_UPDATED[lang]}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-3xl py-12 md:py-16">
        <p className="text-lg leading-relaxed text-foreground/85">{doc.intro}</p>

        {doc.sections.map((section, i) => {
          const blocks: (string | string[])[] = [];
          for (const line of section.body) {
            if (line.startsWith("- ")) {
              const last = blocks[blocks.length - 1];
              if (Array.isArray(last)) last.push(line.slice(2));
              else blocks.push([line.slice(2)]);
            } else blocks.push(line);
          }
          return (
            <section key={section.title} className="mt-10 md:mt-12">
              <h2 className="font-display text-xl md:text-2xl font-black text-foreground">
                <span className="mr-2 text-primary tabular-nums">{i + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-4 space-y-3 text-[15px] md:text-base leading-relaxed text-foreground/80">
                {blocks.map((b, k) =>
                  Array.isArray(b) ? (
                    <ul key={k} className="space-y-2">
                      {b.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rotate-45 bg-secondary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p key={k}>{b}</p>
                  ),
                )}
              </div>
            </section>
          );
        })}

        <div className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
          {lang === "fr" ? "Voir aussi : " : "See also: "}
          <Link to={OTHER[kind].path} className="font-semibold text-primary underline-offset-4 hover:underline">
            {other.title}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
