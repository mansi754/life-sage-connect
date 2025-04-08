
import Layout from "@/components/layout/Layout";
import MentalHealthChat from "@/components/mental-health/MentalHealthChat";

const MentalHealthChatPage = () => {
  return (
    <Layout>
      <div className="health-container py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-health-neutral-900 mb-2">Mental Health Support</h1>
          <p className="text-health-neutral-600 max-w-2xl mx-auto">
            A safe space to discuss mental health concerns and receive support. 
            All conversations are confidential and you can choose to remain anonymous.
          </p>
        </div>
        <MentalHealthChat />
      </div>
    </Layout>
  );
};

export default MentalHealthChatPage;
