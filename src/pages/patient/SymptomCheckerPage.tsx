
import Layout from "@/components/layout/Layout";
import SymptomChecker from "@/components/patient/SymptomChecker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SymptomCheckerPage = () => {
  return (
    <Layout>
      <div className="health-container py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Symptom Checker</h1>
        <Card>
          <CardHeader>
            <CardTitle>Symptom Checker</CardTitle>
            <CardDescription>
              Describe your symptoms to get preliminary guidance. This is not a replacement for professional medical advice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SymptomChecker />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SymptomCheckerPage;
