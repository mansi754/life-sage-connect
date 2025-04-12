
import React from 'react';
import Layout from '@/components/layout/Layout';
import FunctionalTabs from '@/components/functional/FunctionalTabs';
import FunctionalCard from '@/components/functional/FunctionalCard';
import { Button } from '@/components/ui/button';

const DemoComponentsPage = () => {
  // Tab data
  const tabData = [
    {
      id: 'profile',
      title: 'Profile',
      description: 'Manage your personal information',
      content: 'Here you can update your profile details, including name, contact information, and more.'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your account settings',
      content: 'Adjust your account preferences, notification settings, and privacy options.'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Manage your security settings',
      content: 'Change your password, enable two-factor authentication, and view login history.'
    }
  ];

  // Card click handler
  const handleCardClick = (cardName: string) => {
    alert(`You clicked on the ${cardName} card!`);
  };

  return (
    <Layout>
      <div className="health-container py-8">
        <h1 className="text-3xl font-bold mb-8">Demo Components</h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Functional Tabs</h2>
          <FunctionalTabs 
            defaultTab="profile"
            tabs={tabData}
            onTabChange={(tabId) => console.log(`Tab changed to: ${tabId}`)}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Functional Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FunctionalCard
              title="Patient Information"
              description="View and update patient details"
              onClick={() => handleCardClick('Patient Information')}
              variant="primary"
              footerContent={<Button className="w-full">View Details</Button>}
            >
              <p>Access comprehensive patient information including medical history, current medications, and upcoming appointments.</p>
            </FunctionalCard>

            <FunctionalCard
              title="Appointment Scheduling"
              description="Manage your appointments"
              onClick={() => handleCardClick('Appointment Scheduling')}
              variant="secondary"
              footerContent={<Button variant="outline" className="w-full">Schedule Now</Button>}
            >
              <p>Schedule, reschedule, or cancel appointments with healthcare providers.</p>
            </FunctionalCard>

            <FunctionalCard
              title="Health Records"
              description="Access your medical records"
              onClick={() => handleCardClick('Health Records')}
              footerContent={<Button variant="ghost" className="w-full">View Records</Button>}
            >
              <p>View your complete health records, test results, and medical documentation.</p>
            </FunctionalCard>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DemoComponentsPage;
