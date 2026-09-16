import Link from "next/link";
import StatusPill from "./StatusPill";

function formatDate(date) {
  if (!date) return "Date to be announced";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HackathonCard({ hackathon }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[#e5e5e0] bg-white p-5 shadow-[0_2px_10px_rgba(23,23,23,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#93c5fd] hover:shadow-[0_12px_28px_rgba(37,99,235,0.10)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#2563eb]">
          {hackathon.theme}
        </p>
        <StatusPill status={hackathon.status} />
      </div>

      <h2 className="mt-5 text-xl font-bold tracking-tight text-[#171717]">
        <Link className="outline-none hover:text-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563eb]" href={`/hackathons/${hackathon._id}`}>
          {hackathon.title}
        </Link>
      </h2>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#737373]">{hackathon.description}</p>

      <dl className="mt-6 space-y-3 border-t border-[#e5e5e0] pt-4 text-sm">
        <div className="flex items-start justify-between gap-3">
          <dt className="text-[#737373]">Registration</dt>
          <dd className="text-right font-medium text-[#171717]">{formatDate(hackathon.registrationStart)} – {formatDate(hackathon.registrationEnd)}</dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-[#737373]">Team size</dt>
          <dd className="font-medium text-[#171717]">{hackathon.teamSize?.min}–{hackathon.teamSize?.max} people</dd>
        </div>
      </dl>

      <Link className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-[#171717] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2" href={`/hackathons/${hackathon._id}`}>
        View Details
      </Link>
    </article>
  );
}
