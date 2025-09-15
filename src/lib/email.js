import nodemailer from 'nodemailer';

// Configuration du transporteur email pour SendGrid
const createTransporter = () => {
  // Vérifier la configuration SendGrid
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Configuration SendGrid manquante. Configurez SMTP_HOST, SMTP_PORT, SMTP_USER et SMTP_PASS dans votre fichier .env');
  }

  // Configuration SendGrid
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // false pour 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

/**
 * Envoie un email de réinitialisation de mot de passe avec code
 * @param {string} email - L'adresse email du destinataire
 * @param {string} resetCode - Le code de réinitialisation
 * @returns {Promise<Object>} Résultat de l'envoi avec success et messageId
 * @throws {Error} Si l'envoi échoue
 */
export const sendPasswordResetEmail = async (email, resetCode) => {
  try {
    const transporter = createTransporter();

    // Vérifier la connexion
    await transporter.verify();

    const mailOptions = {
      from: {
        name: 'PixelPulse',
        address: process.env.SMTP_USER === 'apikey' ? 'noreply@pixelpulse.com' : process.env.SMTP_USER
      },
      to: email,
      subject: 'Code de réinitialisation de votre mot de passe - PixelPulse',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code de réinitialisation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #000; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; background-color: #f9f9f9; }
            .code { display: inline-block; background-color: #000; color: white; padding: 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>PixelPulse</h1>
              <p>Réinitialisation de mot de passe</p>
            </div>

            <div class="content">
              <h2>Bonjour,</h2>

              <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte PixelPulse.</p>

              <p>Voici votre code de réinitialisation :</p>

              <div class="code">${resetCode}</div>

              <div class="warning">
                <strong>Attention :</strong> Ce code est valable pendant 10 minutes seulement. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
              </div>

              <p>Entrez ce code sur la page de réinitialisation pour créer un nouveau mot de passe.</p>

              <p>Cordialement,<br>L'équipe PixelPulse</p>
            </div>

            <div class="footer">
              <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
              <p>© 2024 PixelPulse. Tous droits réservés.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Code de réinitialisation de mot de passe - PixelPulse

        Bonjour,

        Vous avez demandé la réinitialisation de votre mot de passe.

        Voici votre code de réinitialisation : ${resetCode}

        Ce code est valable pendant 10 minutes.

        Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

        Cordialement,
        L'équipe PixelPulse
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
  }
};

/**
 * Fonction générique pour envoyer des emails
 * @param {string} to - L'adresse email du destinataire
 * @param {string} subject - Le sujet de l'email
 * @param {string} html - Le contenu HTML de l'email
 * @param {string|null} text - Le contenu texte de l'email (optionnel)
 * @returns {Promise<Object>} Résultat de l'envoi avec success et messageId
 * @throws {Error} Si l'envoi échoue
 */
export const sendEmail = async (to, subject, html, text = null) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'PixelPulse',
        address: process.env.SMTP_USER === 'apikey' ? 'noreply@pixelpulse.com' : (process.env.SMTP_USER || 'noreply@pixelpulse.com')
      },
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};