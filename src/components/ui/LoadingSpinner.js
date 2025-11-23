import Image from 'next/image';

/**
 * A loading spinner component displaying the application logo and loading text.
 *
 * @returns {JSX.Element} The loading spinner element
 */
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center">

      <Image src="/logo.png"
        alt="Logo pixelpulse"
        width={40}
        height={40}
        className="h-10" />

      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>

      <p className="body-text text-gray-600">Chargement en cours...</p>
    </div>
  );
} 