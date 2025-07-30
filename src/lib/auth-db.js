// lib/auth-db.js - Fonctions d'authentification avec PostgreSQL
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Créer un nouvel utilisateur (inscription)
export async function createUser(userData) {
  try {
    const { name, username, email, password } = userData;

    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return { success: false, error: "Cet email est déjà utilisé" };
    }

    // Vérifier si le username existe déjà
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return { success: false, error: "Ce nom d'utilisateur est déjà pris" };
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        joinedAt: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Erreur lors de la création du compte" };
  }
}

// Vérifier les identifiants de connexion
export async function verifyCredentials(email, password) {
  try {
    // Récupérer l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        password: true,
        bio: true,
        avatar: true,
        joinedAt: true,
      },
    });

    if (!user) {
      return { success: false, error: "Identifiants invalides" };
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Identifiants invalides" };
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error verifying credentials:", error);
    return { success: false, error: "Erreur lors de la connexion" };
  }
}

// Récupérer un utilisateur par son ID (pour vérifier les tokens)
export async function getUserById(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        joinedAt: true,
        location: true,
        website: true,
        twitter: true,
        linkedin: true,
        github: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

// Récupérer un utilisateur par son email
export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        joinedAt: true,
        location: true,
        website: true,
        twitter: true,
        linkedin: true,
        github: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

// Mettre à jour le profil utilisateur
export async function updateUserProfile(userId, profileData) {
  try {
    // Filtrer les champs autorisés pour la mise à jour
    const allowedFields = {
      ...(profileData.name && { name: profileData.name }),
      ...(profileData.bio && { bio: profileData.bio }),
      ...(profileData.location && { location: profileData.location }),
      ...(profileData.website && { website: profileData.website }),
      ...(profileData.twitter && { twitter: profileData.twitter }),
      ...(profileData.linkedin && { linkedin: profileData.linkedin }),
      ...(profileData.github && { github: profileData.github }),
      ...(profileData.avatar && { avatar: profileData.avatar }),
    };

    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: allowedFields,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        avatar: true,
        joinedAt: true,
        location: true,
        website: true,
        twitter: true,
        linkedin: true,
        github: true,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: "Erreur lors de la mise à jour du profil" };
  }
}

// Changer le mot de passe utilisateur
export async function changeUserPassword(userId, currentPassword, newPassword) {
  try {
    // Récupérer l'utilisateur avec le mot de passe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return { success: false, error: "Mot de passe actuel incorrect" };
    }

    // Hacher le nouveau mot de passe
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        password: hashedNewPassword,
      },
    });

    return { success: true, message: "Mot de passe mis à jour avec succès" };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      error: "Erreur lors du changement de mot de passe",
    };
  }
}

// Vérifier si un email est disponible
export async function isEmailAvailable(email, excludeUserId = null) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return true;
    }

    // Si on exclut un utilisateur (pour les mises à jour)
    if (excludeUserId && existingUser.id === parseInt(excludeUserId)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking email availability:", error);
    return false;
  }
}

// Vérifier si un username est disponible
export async function isUsernameAvailable(username, excludeUserId = null) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      return true;
    }

    // Si on exclut un utilisateur (pour les mises à jour)
    if (excludeUserId && existingUser.id === parseInt(excludeUserId)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking username availability:", error);
    return false;
  }
}
