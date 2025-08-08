// app/api/auth/login/route.js - Version avec debug complet
import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { verifyCredentials } from "@/lib/auth-db";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    console.log("🔐 Login attempt for:", email);

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Vérifier les identifiants dans PostgreSQL
    const result = await verifyCredentials(email, password);

    if (!result.success) {
      console.log("❌ Login failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const user = result.user;

    console.log("🔍 User data before token creation:", {
      id: user.id,
      email: user.email,
      role: user.role,
      hasRole: !!user.role
    });

    // ✅ IMPORTANT: Créer le token JWT AVEC le rôle ET logs
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role || 'reader', // Fallback au cas où
    };

    console.log("🎫 Token payload:", tokenPayload);

    const token = createToken(tokenPayload);

    console.log("✅ Token created successfully, length:", token.length);

    // Créer la réponse avec le token dans un cookie httpOnly
    const response = NextResponse.json({
      success: true,
      user: {
        ...user,
        role: user.role || 'reader' // S'assurer que le rôle est retourné
      },
      message: "Connexion réussie",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    });

    console.log("🍪 Cookie set successfully");

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}