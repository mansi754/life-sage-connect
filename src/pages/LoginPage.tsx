
import React from 'react';
import Layout from '@/components/layout/Layout';
import Login from '@/components/auth/Login';

const LoginPage = () => {
  return (
    <Layout>
      <div className="health-container py-8">
        <Login />
      </div>
    </Layout>
  );
};

export default LoginPage;
