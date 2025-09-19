# TechPulse - Plateforme de blogs pour développeurs

PixelPulse est une plateforme de blogs moderne et performante, conçue pour les développeurs, créateurs de contenu et passionnés de technologie. Elle offre un Riche Ecosystème pour partager connaissances, Veille Technologique et interagir avec une communauté grandissante.

![Capture d'écran 1](placeholder_screenshot_1.png)
![Capture d'écran 2](placeholder_screenshot_2.png)
![Capture d'écran 3](placeholder_screenshot_3.png)
![Capture d'écran 4](placeholder_screenshot_4.png)
## 🌐 Démo en direct

Visitez la version live du projet sur Vercel : [PixelPulse Live](https://pixelpulse-blog.vercel.app/)


## 🔥 Fonctionnalités

*   **Publication d'articles** : Un éditeur de texte riche pour créer et publier vos articles.
*   **Gestion des catégories** : Organisez vos articles en catégories pour une navigation facile.
*   **Commentaires interactifs** : Interagissez avec vos lecteurs grâce à un système de commentaires.
*   **Recherche puissante** : Trouvez rapidement des articles grâce à une recherche performante.
*   **Profils d'auteur** : Mettez en avant votre biographie et vos contributions.

## 🚀 Démarrage rapide

Pour lancer le projet en local, suivez ces étapes :

1.  **Clonez le dépôt**
    ```bash
    git clone https://github.com/Rahim10020/tech-pulse
    cd votre-projet
    ```

2.  **Installez les dépendances**
    ```bash
    npm install
    ```

3.  **Configurez la base de données**
    Créez un fichier `.env` à la racine et ajoutez votre `DATABASE_URL` pour PostgreSQL.
    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    ```

4.  **Appliquez les migrations**
    ```bash
    npx prisma migrate dev
    ```

5.  **Lancez le serveur de développement**
    ```bash
    npm run dev
    ```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## 🛠️ Stack technique

*   **Framework** : [Next.js](https://nextjs.org/)
*   **Base de données** : [PostgreSQL](https://www.postgresql.org/) avec [Prisma](https://www.prisma.io/)
*   **Authentification** : [NextAuth.js](https://next-auth.js.org/)
*   **Styling** : [Tailwind CSS](https://tailwindcss.com/)

---

*Ce projet est un exemple. N'hésitez pas à le personnaliser selon vos besoins.*
