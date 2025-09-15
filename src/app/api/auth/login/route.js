/**
 * POST /api/auth/login
 * Authenticates a user with email and password.
 *
 * @param {Request} request - The request object containing email and password in JSON body
 * @returns {NextResponse} Response with user data and JWT token in httpOnly cookie
 *
 * Request body:
 * - email: string (required) - User's email address
 * - password: string (required) - User's password
 *
 * Response (success):
 * - success: boolean
 * - user: object - User data without password
 * - message: string
 *
 * Response (error):
 * - error: string
 * - code: string - Error code for client handling
 *
 * Sets httpOnly cookie 'token' with JWT containing user info
 */
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