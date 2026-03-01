import type { SpotifyRecentlyPlayedItem } from "@/types/spotify";
import Image from "next/image";

interface RecentlyPlayedCardProps {
  item: SpotifyRecentlyPlayedItem;
}

export function RecentlyPlayedCard({ item }: RecentlyPlayedCardProps) {
  const { track } = item;
  const cover = track.album.images?.[0];
  const artistNames = track.artists.map((a) => a.name).join(", ");

  const playedAt = new Date(item.played_at);
  const formattedTime = playedAt.toLocaleString();

  return (
    <article className="flex items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 shadow-sm shadow-black/40 transition-colors hover:border-zinc-500/80">
      {cover && (
        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-zinc-900">
          <Image
            src={cover.url}
            alt={track.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="truncate text-sm font-semibold text-zinc-50">{track.name}</h3>
        <p className="truncate text-xs text-zinc-400">{artistNames}</p>
        <p className="mt-1 text-[11px] text-zinc-500">{formattedTime}</p>
      </div>
      {track.external_urls?.spotify && (
        <a
          href={track.external_urls.spotify}
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

