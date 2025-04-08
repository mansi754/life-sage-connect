
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <Layout>
      <div className="health-container py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-health-neutral-900 mb-4">About LifeSage Health</h1>
          <p className="text-xl text-health-neutral-600">
            Our mission is to bridge the healthcare gap for underserved and rural communities through innovative technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-health-neutral-900 mb-4">Our Mission</h2>
            <p className="text-health-neutral-700 mb-4">
              At LifeSage Health, we believe that quality healthcare should be accessible to everyone, regardless of where they live or their socioeconomic status. Our platform leverages cutting-edge technology to connect patients in underserved areas with healthcare providers, monitor vital health metrics, and provide mental health support.
            </p>
            <p className="text-health-neutral-700 mb-4">
              We are committed to addressing the unique challenges faced by rural and underserved communities, including limited access to specialists, transportation barriers, and lack of mental health resources.
            </p>
            <Button asChild className="btn-primary mt-2">
              <Link to="/register">Join Our Mission</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-health-blue-100 rounded-full opacity-70 z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop" 
              alt="Healthcare professionals discussing" 
              className="rounded-lg shadow-xl relative z-10"
            />
          </div>
        </div>
        
        <div className="bg-health-neutral-50 rounded-2xl p-8 mb-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-health-neutral-900 mb-4">Our Impact</h2>
            <p className="text-health-neutral-700">
              Since our founding, we've been making a real difference in communities across the country.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-health-blue-500 mb-2">15,000+</div>
              <p className="text-health-neutral-700">Patients connected to quality healthcare</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-health-blue-500 mb-2">500+</div>
              <p className="text-health-neutral-700">Healthcare providers on our platform</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-4xl font-bold text-health-blue-500 mb-2">250+</div>
              <p className="text-health-neutral-700">Rural communities served</p>
            </div>
          </div>
        </div>
        
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-health-neutral-900 mb-4">Our Team</h2>
            <p className="text-health-neutral-700">
              Meet the passionate individuals dedicated to making healthcare accessible for all.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 mx-auto w-32 h-32 overflow-hidden rounded-full border-4 border-health-blue-100">
                <img 
                  src="https://randomuser.me/api/portraits/women/30.jpg" 
                  alt="Dr. Sarah Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-health-neutral-900">Dr. Sarah Johnson</h3>
              <p className="text-health-neutral-600">Founder & CEO</p>
              <p className="text-health-neutral-700 mt-2">
                Former rural healthcare physician with 15 years of experience in telemedicine.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 mx-auto w-32 h-32 overflow-hidden rounded-full border-4 border-health-blue-100">
                <img 
                  src="https://randomuser.me/api/portraits/men/45.jpg" 
                  alt="Michael Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-health-neutral-900">Michael Chen</h3>
              <p className="text-health-neutral-600">Chief Technology Officer</p>
              <p className="text-health-neutral-700 mt-2">
                Health technology expert focused on creating secure, accessible platforms.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 mx-auto w-32 h-32 overflow-hidden rounded-full border-4 border-health-blue-100">
                <img 
                  src="https://randomuser.me/api/portraits/women/65.jpg" 
                  alt="Dr. Maria Rodriguez" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-health-neutral-900">Dr. Maria Rodriguez</h3>
              <p className="text-health-neutral-600">Chief Medical Officer</p>
              <p className="text-health-neutral-700 mt-2">
                Specialist in rural healthcare delivery and telemedicine best practices.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-health-blue-600 to-health-blue-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join LifeSage Health Today</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're a patient seeking care or a provider looking to expand your reach, 
            we invite you to join our community and be part of the healthcare revolution.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-white text-health-blue-700 hover:bg-blue-50 transition-colors">
              <Link to="/register">Create an Account</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 transition-colors">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
