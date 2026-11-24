// Names arrive pasted from social media in Unicode "mathematical bold" letters
// (𝐌𝐁𝐎𝐔𝐍…). NFKC folds them back to ordinary letters so they render in the
// site font, are searchable, and read correctly with screen readers.
export const cleanText = (text: string) => text.normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "");
export const displayName = (name: string) => cleanText(name).replace(/\s+/g, " ").trim();
