# PixelPulse - Blog Platform for Developers

PixelPulse is a modern and high-performance blog platform designed for developers, content creators, and technology enthusiasts. It offers a rich ecosystem for sharing knowledge, technology insights, and interacting with a growing community.

![Screenshot 1](./public/acceuil.png)
![Screenshot 2](placeholder_screenshot_2.png)
![Screenshot 3](placeholder_screenshot_3.png)
![Screenshot 4](placeholder_screenshot_4.png)

## 🌐 Live Demo

Visit the live version of the project on Vercel: [PixelPulse Live](https://pixelpulse-blog.vercel.app/)

## 🔥 Features

* **Article Publishing**: A rich text editor to create and publish your articles.
* **Category Management**: Organize your articles into categories for easy navigation.
* **Interactive Comments**: Engage with your readers through a commenting system.
* **Powerful Search**: Quickly find articles with efficient search functionality.
* **Author Profiles**: Showcase your biography and contributions.

## 🚀 Quick Start

To run the project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rahim10020/tech-pulse
   cd your-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the database**
   Create a `.env` file at the root and add your `DATABASE_URL` for PostgreSQL.
   ```
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

4. **Apply migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org/)
* **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
* **Authentication**: [NextAuth.js](https://next-auth.js.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)

---

*This project is an example. Feel free to customize it according to your needs.*