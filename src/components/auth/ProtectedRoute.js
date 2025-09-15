/**
 * ProtectedRoute component that wraps children and redirects to login if user is not authenticated.
 * Shows loading spinner while checking authentication status.
 *
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The content to render if authenticated
 * @returns {JSX.Element|null} The children if authenticated, loading spinner, or null
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}