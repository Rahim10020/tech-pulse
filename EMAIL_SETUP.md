# Configuration SendGrid - Mot de passe oublié

## 📧 Configuration SendGrid (Production)

### Pourquoi SendGrid ?
- ✅ **100 emails gratuits par jour** (suffisant pour la plupart des projets)
- ✅ **Fiable et professionnel**
- ✅ **Excellente délivrabilité**
- ✅ **API et SMTP supportés**
- ✅ **Tableau de bord détaillé**

### 1. Créer un compte SendGrid
1. Allez sur [sendgrid.com](https://sendgrid.com)
2. Créez un compte gratuit
3. Vérifiez votre email
4. Complétez votre profil

### 2. Créer une clé API
1. Dans votre dashboard, allez dans **"Settings"** → **"API Keys"**
2. Cliquez sur **"Create API Key"**
3. Nommez votre clé (ex: "PixelPulse Production")
4. Choisissez **"Full Access"** ou **"Restricted Access"** avec permissions Mail Send
5. **Copiez la clé API** (elle ne sera plus visible après)

### 3. Configurer l'expéditeur
1. Allez dans **"Settings"** → **"Sender Authentication"**
2. Cliquez sur **"Verify a Single Sender"**
3. Remplissez vos informations :
   - **From Email** : `noreply@pixelpulse.com` (ou votre domaine)
   - **From Name** : `PixelPulse`
   - **Reply To** : Votre email réel
4. Vérifiez l'email de confirmation

### 4. Configurer les variables d'environnement
Dans votre fichier `.env` :

```env
# Configuration SendGrid (recommandé pour production)
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Votre clé API
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Tester la configuration
```bash
# Test avec le script fourni
node scripts/test-sendgrid.js votre-email@test.com

# Ou directement via curl
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"votre-email@test.com"}'
```

### 6. Vérifier les emails envoyés
1. Retournez dans votre dashboard SendGrid
2. Allez dans **"Activity Feed"**
3. Vous verrez tous les emails envoyés avec leur statut

## 📧 Configuration pour Gmail (Alternative)

Si vous préférez Gmail malgré la complexité :

### 1. Activer la vérification en 2 étapes
1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Sécurité → Vérification en 2 étapes → Activer

### 2. Générer un mot de passe d'application
1. Sécurité → Mots de passe d'application
2. Sélectionner "Autre" et nommer "PixelPulse"
3. Copier le mot de passe généré (16 caractères)

### 3. Configurer dans .env
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="abcd-efgh-ijkl-mnop"  # Mot de passe d'application
```

## 🧪 Test de l'envoi d'emails

### Test manuel
```bash
# Démarrer le serveur
npm run dev

# Tester avec curl
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"votre-email@test.com"}'
```

### Vérification
- Vérifiez la console du serveur pour les logs
- Vérifiez votre boîte email (y compris les spams)
- Le token de réinitialisation est valide 10 minutes

## 📋 Fonctionnalités implémentées

✅ **Validation email côté client et serveur**
✅ **Génération de codes sécurisés (6 chiffres)**
✅ **Stockage des codes en base de données**
✅ **Expiration automatique (10 minutes)**
✅ **Protection contre la réutilisation**
✅ **Rate limiting**
✅ **Emails HTML responsives**
✅ **Messages d'erreur en français**

## 🚨 Dépannage

### Erreur de connexion SMTP
- Vérifiez vos identifiants SendGrid
- Pour Gmail, assurez-vous d'utiliser un mot de passe d'application
- Vérifiez que le port 587 n'est pas bloqué

### Emails dans les spams
- Configurez SPF/DKIM pour votre domaine dans SendGrid
- Utilisez un domaine personnalisé au lieu de @gmail.com

### Codes expirés
- Les codes sont valides 10 minutes
- Vérifiez l'heure système du serveur

## 🔒 Sécurité

- **Codes uniques** : Générés aléatoirement (6 chiffres)
- **Expiration** : 10 minutes maximum
- **Utilisation unique** : Codes marqués comme utilisés
- **Rate limiting** : Protection contre les abus
- **Validation** : Côté client et serveur
- **Hashage** : Bcrypt pour les mots de passe

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs du serveur
2. Testez la connexion SMTP manuellement avec le script `test-sendgrid.js`
3. Vérifiez la configuration des variables d'environnement