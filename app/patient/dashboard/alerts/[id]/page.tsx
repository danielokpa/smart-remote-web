// app/patient/dashboard/alerts/[id]/page.tsx

import AlertDetailPage from "@/components/dashboard/alerts/AlertDetailPage";

export default function PatientAlertDetailPage() {
  return (
    <AlertDetailPage authScope="PATIENT" />
  );
}