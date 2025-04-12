
import Layout from "@/components/layout/Layout";
import Register from "@/components/auth/Register";

const RegisterPage = () => {
  return (
    <Layout>
      <div className="py-16 bg-health-neutral-50">
        <div className="max-w-md mx-auto">
          <Register />
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
