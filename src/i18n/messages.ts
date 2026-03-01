import type { Language } from "@/contexts/language-context";

type MessageKey =
  | "appTitle"
  | "welcomeTitle"
  | "welcomeSubtitle"
  | "welcomeDescription"
  | "loginWithSpotify"
  | "logout"
  | "topTracks"
  | "topArtists"
  | "recentlyPlayed"
  | "noData"
  | "languageLabel"
  | "greeting";

type Messages = Record<MessageKey, string>;

const en: Messages = {
  appTitle: "SonarTrack",
  welcomeTitle: "Your Spotify, visualized.",
  welcomeSubtitle: "Minimal, dark and focused on what matters.",
  welcomeDescription:
    "Connect with Spotify to explore your top tracks, favorite artists and recently played songs in a clean and elegant dashboard.",
  loginWithSpotify: "Continue with Spotify",
  logout: "Sign out",
  topTracks: "Top tracks",
  topArtists: "Top artists",
  recentlyPlayed: "Recently played",
  noData: "No data available yet. Try listening to some music on Spotify.",
  languageLabel: "Language",
  greeting: "Hi",
};

const es: Messages = {
  appTitle: "SonarTrack",
  welcomeTitle: "Tu Spotify, visualizado.",
  welcomeSubtitle: "Minimalista, oscuro y centrado en lo importante.",
  welcomeDescription:
    "Conéctate con Spotify para explorar tus canciones más escuchadas, artistas favoritos y reproducciones recientes en un dashboard limpio y elegante.",
  loginWithSpotify: "Continuar con Spotify",
  logout: "Cerrar sesión",
  topTracks: "Top canciones",
  topArtists: "Top artistas",
  recentlyPlayed: "Reproducidas recientemente",
  noData: "Todavía no hay datos. Prueba a escuchar música en Spotify.",
  languageLabel: "Idioma",
  greeting: "Hola",
};

const dictionaries: Record<Language, Messages> = {
  en,
  es,
};

export function useMessages(lang: Language): Messages {
  return dictionaries[lang];
}

