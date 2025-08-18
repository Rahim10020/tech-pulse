// ==========================================
// 3. app/api/drafts/[id]/route.js - CORRIGÉ
// ==========================================
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { publishDraft, updateDraft, deleteDraft } from "@/lib/articles";

export async function PUT(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const { action, ...updateData } = await request.json();
    const draftId = parseInt(params.id);

    if (action === "publish") {
      // Publier le brouillon
      const result = await publishDraft(draftId, decoded.userId);

      if (result.success) {
        return NextResponse.json({
          success: true,
          article: result.article,
          message: "Brouillon publié avec succès",
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    } else {
      // Mise à jour du brouillon
      const result = await updateDraft(draftId, decoded.userId, updateData);

      if (result.success) {
        return NextResponse.json({
          success: true,
          article: result.article,
          message: "Brouillon mis à jour avec succès",
        });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }
  } catch (error) {
    console.error("Error handling draft:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const draftId = parseInt(params.id);
    const result = await deleteDraft(draftId, decoded.userId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Brouillon supprimé avec succès",
      });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting draft:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du brouillon" },
      { status: 500 }
    );
  }
}