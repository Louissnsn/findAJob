import { NextRequest, NextResponse } from "next/server";

async function getAccessToken() {
  const res = await fetch(
    "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.FRANCETRAVAIL_CLIENT_ID!,
        client_secret: process.env.FRANCETRAVAIL_CLIENT_SECRET!,
        scope: "api_offresdemploiv2 o2dsoffre",
      }),
    }
  );

  if (!res.ok) {
    console.error("Erreur lors de la récupération du token");
    throw new Error("Token fetch failed");
  }

  const data = await res.json();
  console.log(data);
  return data.access_token;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const motsCles = searchParams.get("search") || "D1214";
  const commune = searchParams.get("commune") || "62041";

  try {
    const token = await getAccessToken();

    const response = await fetch(
        `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?motsCles=${encodeURIComponent(motsCles)}&commune=${commune}`,
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erreur lors de la récupération des offres" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data.resultats);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
