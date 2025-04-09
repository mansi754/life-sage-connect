
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="health-container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-health-blue-500" />
              <span className="text-xl font-bold text-health-blue-900">LifeSage Health</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-health-neutral-600 hover:text-health-blue-500 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-health-neutral-600 hover:text-health-blue-500 transition-colors">
              About
            </Link>
            <a href="/" className="text-health-neutral-600 hover:text-health-blue-500 transition-colors">
              Services
            </a>
            
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  <Link to={user?.user_metadata?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} className="flex items-center text-health-blue-600 hover:text-health-blue-700">
                    <User className="mr-1 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-health-neutral-600 hover:text-health-blue-500 hover:bg-transparent"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-1 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-health-neutral-600 hover:text-health-blue-500 transition-colors">
                  Login
                </Link>
                <Button asChild className="btn-primary">
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-health-neutral-500 hover:text-health-blue-500 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link 
              to="/" 
              className="block py-2 text-health-neutral-600 hover:text-health-blue-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-health-neutral-600 hover:text-health-blue-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <a 
              href="/" 
              className="block py-2 text-health-neutral-600 hover:text-health-blue-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>
            
            {user ? (
              <>
                <Link 
                  to={user?.user_metadata?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
                  className="flex items-center py-2 text-health-blue-600 hover:text-health-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="mr-1 h-4 w-4" />
                  Dashboard
                </Link>
                <button 
                  className="flex items-center w-full py-2 text-health-neutral-600 hover:text-health-blue-500 transition-colors"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block py-2 text-health-neutral-600 hover:text-health-blue-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Button 
                  asChild
                  className="btn-primary w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
