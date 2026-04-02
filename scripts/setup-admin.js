// scripts/setup-admin.js - Script pour configurer ton compte admin
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log("🚀 Configuration du compte administrateur...");

    const adminEmail = "rahialighi@gmail.com";

    // Vérifier si l'utilisateur existe déjà
    let admin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (admin) {
      // Mettre à jour le rôle si l'utilisateur existe
      admin = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "admin" },
      });
      console.log("✅ Compte existant mis à jour avec le rôle admin");
    } else {
      // Créer le compte admin s'il n'existe pas
      console.log("👤 Création du compte administrateur...");

      const hashedPassword = await bcrypt.hash("admin123", 12); // Change ce mot de passe !

      admin = await prisma.user.create({
        data: {
          username: "rahim@",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          bio: "Administrator and creator of the pixelpulse blog. Passionate about new technologies and web development.",
          joinedAt: new Date(),
        },
      });
      console.log("✅ Compte administrateur créé avec succès");
      console.log(
        "🔑 Mot de passe temporaire: admin123 (à changer dès la première connexion)",
      );
    }

    // Afficher les infos du compte admin
    console.log("\n📋 Informations du compte admin:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Username: ${admin.username}`);
    console.log(`   Rôle: ${admin.role}`);
    console.log(`   ID: ${admin.id}`);

    // Vérifier les permissions (simplifiée)
    console.log("\n🔐 Vérification des permissions...");

    // Vérification simple basée sur le rôle
    const isAdminRole = admin.role === "admin";

    console.log(`   Est admin: ${isAdminRole ? "✅" : "❌"}`);
    console.log(`   Peut écrire des articles: ${isAdminRole ? "✅" : "❌"}`);
    console.log(`   Peut gérer les utilisateurs: ${isAdminRole ? "✅" : "❌"}`);

    console.log("\n🎉 Configuration terminée avec succès !");
    console.log("\n📝 Prochaines étapes:");
    console.log("   1. Connecte-toi sur /secret-admin-access");
    console.log("   2. Change ton mot de passe depuis ton profil");
    console.log("   3. Tu peux maintenant écrire des articles !");
  } catch (error) {
    console.error("❌ Erreur lors de la configuration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
setupAdmin();
