
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";

const AlertsPage = () => {
  const {
    loading,
    filteredPatients,
    alerts,
    handleAlertRespond
  } = useDoctorDashboard();

  if (loading) {
    return (
      <Layout>
        <div className="health-container py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-health-blue-500 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const emergencyAlerts = alerts.filter(alert => alert.type === 'emergency');
  const vitalAlerts = alerts.filter(alert => alert.type === 'vitals');
  const medicationAlerts = alerts.filter(alert => alert.type === 'medication');

  return (
    <Layout>
      <div className="health-container py-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
            <p className="text-health-neutral-600">
              {alerts.length > 0 
                ? `You have ${alerts.length} alerts that need your attention.` 
                : "No active alerts at this time."}
            </p>
          </div>
          {emergencyAlerts.length > 0 && (
            <div className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded-md">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="font-medium">{emergencyAlerts.length} Emergency Alerts</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-red-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emergencyAlerts.length}</div>
              <div className="text-xs text-health-neutral-500">
                {emergencyAlerts.length > 0 ? "Require immediate attention" : "No emergency alerts"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-amber-700">
                <Bell className="h-4 w-4 mr-2" />
                Vital Sign Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vitalAlerts.length}</div>
              <div className="text-xs text-health-neutral-500">
                {vitalAlerts.length > 0 ? "Need review" : "No vital sign alerts"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-blue-700">
                <Bell className="h-4 w-4 mr-2" />
                Medication Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{medicationAlerts.length}</div>
              <div className="text-xs text-health-neutral-500">
                {medicationAlerts.length > 0 ? "Medication compliance" : "No medication alerts"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-amber-500" />
              Active Alerts
            </CardTitle>
            <CardDescription>
              Patient alerts that need your attention.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => {
                  const patientRecord = filteredPatients.find(p => p.patient.id === alert.patientId);
                  
                  return (
                    <div key={alert.id} className={`p-4 rounded-lg ${
                      alert.type === 'emergency' ? 'bg-red-50 border border-red-200' : 
                      alert.type === 'vitals' ? 'bg-amber-50 border border-amber-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${
                            alert.type === 'emergency' ? 'text-red-700' : 
                            alert.type === 'vitals' ? 'text-amber-700' :
                            'text-blue-700'
                          }`}>
                            {alert.type === 'emergency' ? 'Emergency Alert' : 
                             alert.type === 'vitals' ? 'Vital Sign Alert' :
                             'Medication Alert'}
                          </h4>
                          <p className="font-medium mt-1">
                            {patientRecord 
                              ? `${patientRecord.patient.firstName} ${patientRecord.patient.lastName}` 
                              : `Patient #${alert.patientId}`
                            }
                          </p>
                          <p className="text-health-neutral-700 mt-1">{alert.message}</p>
                          <p className="text-sm text-health-neutral-500 mt-2">
                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          className={
                            alert.type === 'emergency' ? 'bg-red-500 hover:bg-red-600' : 
                            alert.type === 'vitals' ? 'bg-amber-500 hover:bg-amber-600' :
                            'bg-blue-500 hover:bg-blue-600'
                          }
                          onClick={() => handleAlertRespond(alert.id)}
                        >
                          Respond
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-health-neutral-300 mx-auto mb-3" />
                <p className="text-health-neutral-500">No active alerts at this time.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AlertsPage;
