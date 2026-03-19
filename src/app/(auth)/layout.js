import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié pour les pages d'auth */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo pixelpulse"
              width={100}
              height={100}
            />
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
