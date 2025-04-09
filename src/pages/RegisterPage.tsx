
import React from 'react';
import Layout from '@/components/layout/Layout';
import Register from '@/components/auth/Register';

const RegisterPage = () => {
  return (
    <Layout>
      <div className="health-container py-8">
        <Register />
      </div>
    </Layout>
  );
};

export default RegisterPage;
