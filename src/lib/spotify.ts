import {
  type SpotifyTopTracksResponse,
  type SpotifyTopArtistsResponse,
  type SpotifyRecentlyPlayedResponse,
} from "@/types/spotify";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

async function spotifyFetch<T>(accessToken: string, endpoint: string, searchParams?: URLSearchParams) {
  const url = new URL(`${SPOTIFY_API_BASE}${endpoint}`);
  if (searchParams) {
    url.search = searchParams.toString();
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Spotify API error", response.status, await response.text());
    throw new Error("Error al obtener datos de Spotify");
  }

  return (await response.json()) as T;
}

export async function getTopTracks(accessToken: string, limit = 10) {
  const searchParams = new URLSearchParams({
    limit: String(limit),
    time_range: "medium_term",
  });

  const data = await spotifyFetch<SpotifyTopTracksResponse>(
    accessToken,
    "/me/top/tracks",
    searchParams,
  );

  return data.items;
}

export async function getTopArtists(accessToken: string, limit = 6) {
  const searchParams = new URLSearchParams({
    limit: String(limit),
    time_range: "medium_term",
  });

  const data = await spotifyFetch<SpotifyTopArtistsResponse>(
    accessToken,
    "/me/top/artists",
    searchParams,
  );

  return data.items;
}

export async function getRecentlyPlayed(accessToken: string, limit = 6) {
  const searchParams = new URLSearchParams({
    limit: String(limit),
  });

  const data = await spotifyFetch<SpotifyRecentlyPlayedResponse>(
    accessToken,
    "/me/player/recently-played",
    searchParams,
  );

  return data.items;
}

