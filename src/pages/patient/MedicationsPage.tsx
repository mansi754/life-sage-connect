
import Layout from "@/components/layout/Layout";
import MedicationList from "@/components/patient/MedicationList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MedicationsPage = () => {
  return (
    <Layout>
      <div className="health-container py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Medication Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Medication Management</CardTitle>
            <CardDescription>
              Keep track of your medications, dosages, and schedules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MedicationList />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MedicationsPage;
