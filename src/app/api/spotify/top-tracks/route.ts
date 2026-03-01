import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getTopTracks } from "@/lib/spotify";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tracks = await getTopTracks((session as any).accessToken as string, 10);
    return NextResponse.json({ items: tracks });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch top tracks",
      },
      { status: 500 },
    );
  }
}

