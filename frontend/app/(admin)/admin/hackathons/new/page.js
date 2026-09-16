import AdminRouteGuard from "@/app/components/AdminRouteGuard";
import HackathonForm from "../../../../components/HackathonForm";

export default function NewHackathonPage() {
  return (
    <AdminRouteGuard>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
            Hackathons
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#171717]">
            Create Hackathon
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#737373]">
            Set up the basics, timeline, and team rules for a new event.
          </p>
        </div>

        <HackathonForm />
      </main>
    </AdminRouteGuard>
  );
}
