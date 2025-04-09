
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-health-blue-600 to-health-blue-800 text-white">
      <div className="health-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Healthcare Revolution Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Take control of your health journey with LifeSage Health's innovative platform.
            Whether you're a patient seeking care or a provider looking to expand your reach,
            we're here to connect you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-white text-health-blue-700 hover:bg-blue-50 transition-colors text-base py-6 px-8">
              <Link to="/register">
                Create an Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 transition-colors text-base py-6 px-8">
              <a href="/about">
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
