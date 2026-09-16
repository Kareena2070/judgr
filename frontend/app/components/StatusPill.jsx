export default function StatusPill({ status }) {
  const styles = {
    DRAFT: "bg-[#f1f1ee] text-[#737373]",
    REGISTRATION: "bg-[#dbeafe] text-[#1d4ed8]",
    SUBMISSION: "bg-[#fef3c7] text-[#a16207]",
    JUDGING: "bg-[#fef3c7] text-[#a16207]",
    COMPLETED: "bg-[#dcfce7] text-[#15803d]",
    OPEN: "bg-[#dbeafe] text-[#1d4ed8]",
    CLOSED: "bg-[#fee2e2] text-[#b91c1c]",
  };

  const labels = {
    DRAFT: "Draft",
    REGISTRATION: "Registration",
    SUBMISSION: "Submission",
    JUDGING: "Judging",
    COMPLETED: "Completed",
    OPEN: "Open",
    CLOSED: "Closed",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-[#f1f1ee] text-[#737373]"
      }`}
    >
      {labels[status] || status}
    </span>
  );
}