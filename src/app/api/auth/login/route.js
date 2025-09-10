// ========================================
// 3. MODIFIER src/app/api/auth/login/route.js
// ========================================

import { NextResponse } from "next/server";
import { successResponse, validationErrorResponse, errorResponse } from "@/lib/api-response";
import { createToken } from "@/lib/auth";
import { verifyCredentials } from "@/lib/auth-db";
import { withRateLimit } from "@/lib/rate-limit";

async function loginHandler(request) {
  try {
    const { email, password } = await request.json();

    console.log("🔐 Login attempt for:", email);

    // Validation des données
    if (!email || !password) {
      return validationErrorResponse("Email et mot de passe requis", "MISSING_CREDENTIALS");
    }

    // Vérifier les identifiants dans PostgreSQL
    const result = await verifyCredentials(email, password);

    if (!result.success) {
      console.log("❌ Login failed:", result.error);
      return validationErrorResponse(result.error, "INVALID_CREDENTIALS");
    }

    const user = result.user;

    // Créer le token JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role || 'reader',
    };

    const token = await createToken(tokenPayload);

    // Créer la réponse avec le token dans un cookie httpOnly
    const response = successResponse({
      user: {
        ...user,
        role: user.role || 'reader'
      }
    }, "Connexion réussie");

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ Login error:", error);
    return errorResponse("Erreur interne du serveur", "INTERNAL_ERROR");
  }
}

// ✅ APPLIQUER LE RATE LIMITING
export const POST = withRateLimit('auth')(loginHandler);