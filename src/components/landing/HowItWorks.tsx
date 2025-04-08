
import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up as a patient or healthcare provider with a simple and secure registration process.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Complete Your Profile",
    description: "Add your health information or professional credentials to personalize your experience.",
    image: "https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Connect Your Devices",
    description: "Link your wearable health devices to monitor vital signs and health metrics in real-time.",
    image: "https://images.unsplash.com/photo-1510017803434-a899398421b3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Access Healthcare Services",
    description: "Book virtual consultations, use the symptom checker, or connect with mental health support.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="health-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-health-neutral-900 font-bold mb-4">
            How LifeSage Health Works
          </h2>
          <p className="text-lg text-health-neutral-600">
            Getting started with quality healthcare is simple and straightforward.
          </p>
        </div>
        
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="bg-health-neutral-900/5 rounded-lg p-1">
                  <img 
                    src={step.image} 
                    alt={step.title} 
                    className="rounded-lg shadow-md w-full h-auto object-cover"
                    style={{ aspectRatio: "16/9" }}
                  />
                </div>
              </div>
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-health-blue-100 text-health-blue-500 mr-4">
                    <span className="text-lg font-semibold">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-health-neutral-900">{step.title}</h3>
                </div>
                <p className="text-health-neutral-600 text-lg mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-health-neutral-700">
                        {index === 0 && item === 1 && "Quick and secure sign-up with email or phone"}
                        {index === 0 && item === 2 && "Choose your user type: patient or provider"}
                        {index === 0 && item === 3 && "Verify your identity for enhanced security"}
                        
                        {index === 1 && item === 1 && "Enter basic health information or credentials"}
                        {index === 1 && item === 2 && "Upload necessary documents securely"}
                        {index === 1 && item === 3 && "Complete HIPAA-compliant consent forms"}
                        
                        {index === 2 && item === 1 && "Compatible with major health wearables"}
                        {index === 2 && item === 2 && "Automatic data synchronization"}
                        {index === 2 && item === 3 && "Set up custom alerts for key health metrics"}
                        
                        {index === 3 && item === 1 && "Schedule appointments with specialists"}
                        {index === 3 && item === 2 && "Access emergency care with one tap"}
                        {index === 3 && item === 3 && "Join support groups for specific conditions"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
