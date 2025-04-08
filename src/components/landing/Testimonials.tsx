
const testimonials = [
  {
    quote: "LifeSage Health has revolutionized how I manage my diabetes. Living 50 miles from the nearest specialist, I now receive quality care without the travel.",
    author: "Sarah Johnson",
    role: "Patient, Rural Montana",
    image: "https://randomuser.me/api/portraits/women/45.jpg"
  },
  {
    quote: "As a physician, I can now extend my reach to patients who previously had limited access to specialists. The platform is intuitive and secure.",
    author: "Dr. Michael Chen",
    role: "Cardiologist",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    quote: "The mental health support through LifeSage has been a lifeline for our community that previously had no access to counseling services.",
    author: "Emily Rodriguez",
    role: "Community Health Worker",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-health-neutral-50">
      <div className="health-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-health-neutral-900 font-bold mb-4">
            Trusted by Patients and Providers
          </h2>
          <p className="text-lg text-health-neutral-600">
            Hear from people whose lives have been improved by LifeSage Health's innovative approach to healthcare.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-health-neutral-900">{testimonial.author}</h4>
                  <p className="text-sm text-health-neutral-500">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="text-health-neutral-700 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
