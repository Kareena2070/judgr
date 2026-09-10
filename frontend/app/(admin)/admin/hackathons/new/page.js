import AdminRouteGuard from "@/app/components/AdminRouteGuard";
import HackathonForm from "../../../../components/HackathonForm";

export default function NewHackathonPage() {
  return (
    <AdminRouteGuard>
      <div>
        <h1>Create Hackathon</h1>

        <HackathonForm />
      </div>
     </AdminRouteGuard>
  );
}
