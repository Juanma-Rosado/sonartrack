"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { useMessages } from "@/i18n/messages";
import type {
  SpotifyArtist,
  SpotifyRecentlyPlayedItem,
  SpotifyTrack,
} from "@/types/spotify";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { TrackCard } from "@/components/spotify/TrackCard";
import { ArtistCard } from "@/components/spotify/ArtistCard";
import { RecentlyPlayedCard } from "@/components/spotify/RecentlyPlayedCard";

interface DashboardData {
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyRecentlyPlayedItem[];
}

export default function Home() {
  const { data: session, status } = useSession();
  const { language } = useLanguage();
  const t = useMessages(language);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError(null);

        const [tracksRes, artistsRes, recentRes] = await Promise.all([
          fetch("/api/spotify/top-tracks"),
          fetch("/api/spotify/top-artists"),
          fetch("/api/spotify/recently-played"),
        ]);

        if (!tracksRes.ok || !artistsRes.ok || !recentRes.ok) {
          throw new Error("Failed to fetch Spotify data");
        }

        const tracksJson = await tracksRes.json();
        const artistsJson = await artistsRes.json();
        const recentJson = await recentRes.json();

        setData({
          topTracks: tracksJson.items ?? [],
          topArtists: artistsJson.items ?? [],
          recentlyPlayed: recentJson.items ?? [],
        });
      } catch (e) {
        console.error(e);
        setError(
          language === "en"
            ? "There was a problem loading your Spotify data."
            : "Hubo un problema al cargar tus datos de Spotify.",
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [status, language]);

  const isAuthenticated = status === "authenticated";

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/40">
            <span className="text-sm font-semibold text-emerald-300">ST</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-zinc-50 tracking-tight">
              {t.appTitle}
            </h1>
            <p className="text-xs text-zinc-500">
              {language === "en"
                ? "Spotify listening stats in a dark, minimal dashboard."
                : "Estadísticas de escucha de Spotify en un dashboard oscuro y minimalista."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          {isAuthenticated && session?.user && (
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-200 shadow-sm shadow-black/40 transition-colors hover:border-zinc-500 hover:text-zinc-50"
            >
              {t.logout}
            </button>
          )}
        </div>
      </header>

      {!isAuthenticated && status !== "loading" && (
        <section className="mt-6 flex flex-1 flex-col items-center justify-center gap-8 text-center sm:mt-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-200 shadow-sm shadow-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>
              {language === "en"
                ? "Secure login with Spotify"
                : "Inicio de sesión seguro con Spotify"}
            </span>
          </div>

          <div className="space-y-4 max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              {t.welcomeTitle}
            </h2>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              {t.welcomeSubtitle}
            </p>
            <p className="text-sm leading-relaxed text-zinc-400">{t.welcomeDescription}</p>
          </div>

          <button
            type="button"
            onClick={() => signIn("spotify")}
            className="inline-flex items-center gap-3 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/40 transition-transform hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10">
              <Image
                src="/window.svg"
                alt="Spotify logo"
                width={16}
                height={16}
                className="opacity-90"
              />
            </span>
            <span>{t.loginWithSpotify}</span>
          </button>

          <p className="max-w-md text-xs text-zinc-500">
            {language === "en"
              ? "We only request the permissions needed to read your profile and listening history. You can revoke access at any time from your Spotify account."
              : "Solo solicitamos los permisos necesarios para leer tu perfil e historial de escucha. Puedes revocar el acceso en cualquier momento desde tu cuenta de Spotify."}
          </p>
        </section>
      )}

      {status === "loading" && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-zinc-400">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />
            <p className="text-xs">
              {language === "en" ? "Checking your session..." : "Comprobando tu sesión..."}
            </p>
          </div>
        </div>
      )}

      {isAuthenticated && session?.user && (
        <section className="mt-4 flex-1 space-y-8">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-5 shadow-lg shadow-black/60 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {session.user.image && (
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "Spotify user"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {language === "en" ? "Signed in as" : "Conectado como"}
                </p>
                <p className="text-sm font-semibold text-zinc-50">
                  {session.user.name ?? session.user.email}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-zinc-500">
                {t.greeting},{" "}
                <span className="font-semibold text-zinc-100">
                  {session.user.name?.split(" ")[0] ?? ""}
                </span>
              </p>
              <p className="text-xs text-zinc-500">
                {language === "en"
                  ? "Here is a snapshot of your current listening habits."
                  : "Este es un vistazo a tus hábitos de escucha actuales."}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {t.topTracks}
              </h2>

              {loadingData && !data && (
                <div className="space-y-2">
                  <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-900/80" />
                  <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-900/80" />
                  <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-900/80" />
                </div>
              )}

              {!loadingData && data?.topTracks && data.topTracks.length > 0 && (
                <div className="flex flex-col gap-2">
                  {data.topTracks.slice(0, 10).map((track, index) => (
                    <TrackCard key={track.id} track={track} rank={index + 1} />
                  ))}
                </div>
              )}

              {!loadingData && (!data?.topTracks || data.topTracks.length === 0) && (
                <p className="text-xs text-zinc-500">{t.noData}</p>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {t.topArtists}
                </h2>

                {loadingData && !data && (
                  <div className="space-y-2">
                    <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-900/80" />
                    <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-900/80" />
                  </div>
                )}

                {!loadingData && data?.topArtists && data.topArtists.length > 0 && (
                  <div className="space-y-2">
                    {data.topArtists.slice(0, 6).map((artist, index) => (
                      <ArtistCard key={artist.id} artist={artist} rank={index + 1} />
                    ))}
                  </div>
                )}

                {!loadingData && (!data?.topArtists || data.topArtists.length === 0) && (
                  <p className="text-xs text-zinc-500">{t.noData}</p>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  {t.recentlyPlayed}
                </h2>

                {loadingData && !data && (
                  <div className="space-y-2">
                    <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-900/80" />
                    <div className="h-14 w-full animate-pulse rounded-xl bg-zinc-900/80" />
                  </div>
                )}

                {!loadingData &&
                  data?.recentlyPlayed &&
                  data.recentlyPlayed.length > 0 && (
                    <div className="space-y-2">
                      {data.recentlyPlayed.slice(0, 6).map((item) => (
                        <RecentlyPlayedCard
                          key={`${item.played_at}-${item.track.id}`}
                          item={item}
                        />
                      ))}
                    </div>
                  )}

                {!loadingData &&
                  (!data?.recentlyPlayed || data.recentlyPlayed.length === 0) && (
                    <p className="text-xs text-zinc-500">{t.noData}</p>
                  )}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
