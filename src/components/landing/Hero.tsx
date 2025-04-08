
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-pattern py-20 md:py-32">
      <div className="health-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-bold text-health-neutral-900 mb-6">
              Bridging Healthcare Gaps in Rural Communities
            </h1>
            <p className="text-xl text-health-neutral-600 mb-8">
              LifeSage Health connects underserved populations with quality healthcare through cutting-edge technology. Access doctors, monitor your health, and receive support from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="btn-primary text-base py-6 px-8">
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="text-base py-6 px-8 border-health-blue-500 text-health-blue-500 hover:bg-health-blue-50">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:flex justify-end hidden">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-40 h-40 bg-health-green-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-health-blue-100 rounded-full opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=2128&auto=format&fit=crop" 
                alt="Healthcare professionals"
                className="relative z-10 rounded-lg shadow-xl max-w-md h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
