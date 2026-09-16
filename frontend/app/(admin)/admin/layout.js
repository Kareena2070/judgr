import Link from "next/link";

const navigation = [
  { label: "Overview", href: "/admin" },
  { label: "Hackathons", href: "/admin/hackathons" },
];

const futureSections = ["Teams", "Submissions", "Judging"];

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#f8f8f6]">
      <aside className="hidden w-60 shrink-0 border-r border-[#e5e5e0] bg-white md:block">
        <div className="sticky top-0 flex min-h-[calc(100vh-4rem)] flex-col p-4">
          <div className="px-3 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2563eb]">
              Admin workspace
            </p>
            <p className="mt-2 text-sm font-semibold text-[#171717]">Manage Judgr</p>
          </div>

          <nav className="mt-2 space-y-1" aria-label="Admin navigation">
            {navigation.map((item) => (
              <Link
                className="block rounded-md px-3 py-2 text-sm font-medium text-[#737373] transition-colors hover:bg-[#f1f1ee] hover:text-[#171717]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#a3a3a3]">
              Coming next
            </p>
            <div className="mt-2 space-y-1">
              {futureSections.map((section) => (
                <span
                  className="block cursor-default rounded-md px-3 py-2 text-sm text-[#a3a3a3]"
                  key={section}
                >
                  {section}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="border-b border-[#e5e5e0] bg-white px-4 py-3 md:hidden">
          <nav className="flex items-center gap-2 overflow-x-auto" aria-label="Admin navigation">
            {navigation.map((item) => (
              <Link
                className="shrink-0 rounded-md px-3 py-2 text-sm font-medium text-[#737373] hover:bg-[#f1f1ee] hover:text-[#171717]"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
            {futureSections.map((section) => (
              <span className="shrink-0 px-3 py-2 text-sm text-[#a3a3a3]" key={section}>
                {section}
              </span>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
