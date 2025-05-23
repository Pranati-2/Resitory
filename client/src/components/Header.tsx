import { Link } from "wouter";
import { useAuth } from '@/contexts/AuthContext'; // Step 1: Import useAuth
import { LogIn, LogOut, UserCircle2 } from 'lucide-react'; // Step 1: Import icons
import { Button } from '@/components/ui/button'; // Step 1: Import Button

export default function Header() {
  // Step 2: Use useAuth Hook
  const { user, isLoading, logout: contextLogout } = useAuth();

  // Step 3: Implement Logout Handler
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        contextLogout(); // Update AuthContext state
        // Optional: Redirect to home or show a message
        // window.location.href = '/'; 
      } else {
        console.error('Logout failed:', await response.text());
        // Handle logout error (e.g., show a message to the user)
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40"> {/* Increased z-index for potential dropdowns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                {/* Using a simple letter or an SVG for the logo */}
                <span className="text-white font-bold text-lg">LP</span> 
              </div>
              <span className="ml-2 text-xl font-medium text-gray-900">LearnPath</span>
            </Link>
          </div>
          
          {/* Mobile Navigation Toggle (functionality not implemented in this task) */}
          <div className="md:hidden">
            <button type="button" className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6"> {/* Reduced space for more items */}
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              Home
            </Link>
            {/* <Link href="/discover" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              Discover
            </Link> */}
            {user && ( // Only show "My Paths" if user is logged in
              <Link href="/mypaths" className="text-sm font-medium text-gray-600 hover:text-primary-600">
                My Paths
              </Link>
            )}
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary-600">
              About
            </Link>
          </nav>
          
          {/* Authentication Section - Step 4: Conditional Rendering */}
          <div className="hidden md:flex items-center gap-2"> {/* Use gap for spacing */}
            {isLoading ? (
              <div className="text-sm text-gray-500 h-8 flex items-center">Loading...</div> // Matched height of button
            ) : user ? (
              <>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName || 'User Avatar'} className="h-8 w-8 rounded-full" />
                ) : (
                  <UserCircle2 className="h-7 w-7 text-gray-600" />
                )}
                <span className="text-sm font-medium text-gray-700 hidden lg:inline"> {/* Hidden on md, shown on lg */}
                  {user.displayName || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 md:mr-2" /> {/* Always show icon, text conditional */}
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            ) : (
              <a href="/auth/google"> {/* Direct link to backend OAuth route */}
                <Button variant="default" size="sm"> {/* Changed from outline to default for login */}
                  <LogIn className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Login with Google</span>
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
