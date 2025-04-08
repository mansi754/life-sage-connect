
import { Activity, Video, Brain, Shield, Bell, Users } from "lucide-react";

const features = [
  {
    title: "Health Monitoring",
    description: "Track vital signs and health data with wearable device integration.",
    icon: Activity,
    color: "text-health-blue-500",
    bgColor: "bg-health-blue-50",
  },
  {
    title: "Virtual Consultations",
    description: "Connect with healthcare providers via secure video calls.",
    icon: Video,
    color: "text-health-green-500",
    bgColor: "bg-health-green-50",
  },
  {
    title: "Mental Health Support",
    description: "Access anonymous mental health resources and counseling.",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "Secure Data Storage",
    description: "Your health records protected with blockchain-based encryption.",
    icon: Shield,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Emergency Alerts",
    description: "One-tap emergency alerts sent directly to your healthcare provider.",
    icon: Bell,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    title: "Community Support",
    description: "Connect with others in similar situations for shared experiences.",
    icon: Users,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="health-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-health-neutral-900 font-bold mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-lg text-health-neutral-600">
            Our platform offers a wide range of features designed to make quality healthcare 
            accessible to everyone, especially those in underserved and rural areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-health-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`${feature.bgColor} ${feature.color} p-3 rounded-lg inline-block mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-health-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-health-neutral-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
