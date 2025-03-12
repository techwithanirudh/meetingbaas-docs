export const locales = [
  {
    name: 'English',
    locale: 'en',
  },
  {
    name: 'French',
    locale: 'fr',
  },
];

export const translations =
  {
    en: (await import("@/content/ui.json")).default,
    fr: (await import("@/content/ui.fr.json")).default,
  }

export type Languages = "en" | "fr"