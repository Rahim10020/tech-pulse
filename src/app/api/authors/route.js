// app/api/authors/route.js - API Route pour les auteurs
import { NextResponse } from "next/server";
import {
  getAllAuthors,
  getAuthorById,
  getAuthorByUsername,
  getAuthorProfile,
} from "@/lib/authors";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "all";
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const limit = parseInt(searchParams.get("limit")) || 10;

    let result;

    switch (type) {
      case "single":
        if (id) {
          result = await getAuthorById(parseInt(id));
        } else if (username) {
          // Utiliser getAuthorProfile pour avoir les articles
          result = await getAuthorProfile(username);
        } else {
          return NextResponse.json(
            { error: "ID ou username requis" },
            { status: 400 }
          );
        }
        break;
      case "profile":
        if (!username) {
          return NextResponse.json(
            { error: "Username requis pour le profil" },
            { status: 400 }
          );
        }
        result = await getAuthorProfile(username);
        break;
      case "all":
      default:
        result = await getAllAuthors();
        break;
    }

    if (type === "single" || type === "profile") {
      if (!result) {
        return NextResponse.json(
          { error: "Auteur non trouvé" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des auteurs" },
      { status: 500 }
    );
  }
}
