import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getRecentlyPlayed } from "@/lib/spotify";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await getRecentlyPlayed((session as any).accessToken as string, 6);
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch recently played tracks",
      },
      { status: 500 },
    );
  }
}

