import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="ml-2 text-xl font-medium text-gray-900">Repository</span>
            </Link>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button type="button" className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-sm font-medium text-primary-500 hover:text-primary-700">
              Home
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Discover
            </Link>
            <Link href="/mypaths" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              My Paths
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center">
            <button 
              type="button" 
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 transition duration-150"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
