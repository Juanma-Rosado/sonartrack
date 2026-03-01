import type { SpotifyArtist } from "@/types/spotify";
import Image from "next/image";

interface ArtistCardProps {
  artist: SpotifyArtist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const image = artist.images?.[0];

  return (
    <article className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 shadow-sm shadow-black/40 transition-colors hover:border-zinc-500/80">
      {image && (
        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-zinc-900">
          <Image
            src={image.url}
            alt={artist.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-sm font-semibold text-zinc-50">{artist.name}</h3>
      </div>
      {artist.external_urls?.spotify && (
        <a
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
        >
          Open
        </a>
      )}
    </article>
  );
}

