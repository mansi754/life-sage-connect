
import Layout from "@/components/layout/Layout";
import Login from "@/components/auth/Login";

const LoginPage = () => {
  return (
    <Layout>
      <div className="py-16 bg-health-neutral-50">
        <div className="max-w-md mx-auto">
          <Login />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
