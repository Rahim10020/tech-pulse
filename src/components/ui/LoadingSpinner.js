import Image from "next/image";

/**
 * A loading spinner component displaying the application logo and loading text.
 *
 * @returns {JSX.Element} The loading spinner element
 */
export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <Image src="/logo.png" alt="Logo pixelpulse" width={100} height={100} />

      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>

    </div>
  );
}
