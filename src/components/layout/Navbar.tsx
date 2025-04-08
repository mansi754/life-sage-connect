
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <Link to="/services" className="text-health-neutral-600 hover:text-health-blue-500 transition-colors">
              Services
            </Link>
            <Link to="/login" className="text-health-neutral-600 hover:text-health-blue-500 transition-colors">
              Login
            </Link>
            <Button className="btn-primary">Register</Button>
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
            <Link 
              to="/services" 
              className="block py-2 text-health-neutral-600 hover:text-health-blue-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/login" 
              className="block py-2 text-health-neutral-600 hover:text-health-blue-500 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Button 
              className="btn-primary w-full"
              onClick={() => setIsOpen(false)}
            >
              Register
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
