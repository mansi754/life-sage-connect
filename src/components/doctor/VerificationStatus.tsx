
import { Shield, ShieldAlert, ShieldCheck, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { VerificationStatus as VerificationStatusType } from "@/types/user";

interface VerificationStatusProps {
  status?: VerificationStatusType;
}

const VerificationStatus = ({ status = "pending" }: VerificationStatusProps) => {
  if (status === "verified") {
    return (
      <Alert className="bg-health-green-50 border-health-green-200 text-health-green-800">
        <ShieldCheck className="h-5 w-5 text-health-green-500" />
        <AlertTitle className="text-health-green-700 font-medium">Verified Healthcare Provider</AlertTitle>
        <AlertDescription className="text-health-green-600">
          Your medical credentials have been verified. You have full access to the platform.
        </AlertDescription>
      </Alert>
    );
  } else if (status === "rejected") {
    return (
      <Alert className="bg-health-red-50 border-health-red-200 text-health-red-800">
        <ShieldAlert className="h-5 w-5 text-health-red-500" />
        <AlertTitle className="text-health-red-700 font-medium">Verification Failed</AlertTitle>
        <AlertDescription className="text-health-red-600">
          Your submitted credentials could not be verified. Please contact support for more information or to resubmit your documents.
        </AlertDescription>
      </Alert>
    );
  } else {
    return (
      <Alert className="bg-health-amber-50 border-health-amber-200 text-health-amber-800">
        <Clock className="h-5 w-5 text-health-amber-500" />
        <AlertTitle className="text-health-amber-700 font-medium">Verification Pending</AlertTitle>
        <AlertDescription className="text-health-amber-600">
          Your medical credentials are being reviewed by our team. This process usually takes 1-2 business days. 
          You currently have limited access to the platform.
        </AlertDescription>
      </Alert>
    );
  }
};

export default VerificationStatus;
