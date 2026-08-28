export type TestWord = {
  id: number;
  word: string;
  translation_id: string;
  translation: string;
  lang_word: "en" | "uk";
  lang_translation: "en" | "uk";
  pos: "noun" | "verb" | "adjective" | "adverb" | "other";
  repeats: number;
};