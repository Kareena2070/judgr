import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e5e5e0] bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <Link className="text-xl font-bold tracking-tight text-[#171717]" href="/">
            Judgr
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-[#737373]">
            A focused home for discovering hackathons, forming teams, and building work worth sharing.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#171717]">Platform</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#737373]">
            <li><Link className="hover:text-[#1d4ed8]" href="/hackathons">Hackathons</Link></li>
            <li><Link className="hover:text-[#1d4ed8]" href="/#how-it-works">How It Works</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#171717]">Account</h2>
          <ul className="mt-3 space-y-2 text-sm text-[#737373]">
            <li><Link className="hover:text-[#1d4ed8]" href="/login">Login</Link></li>
            <li><Link className="hover:text-[#1d4ed8]" href="/register">Register</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#171717]">Developer</h2>
          <a
            className="mt-3 inline-block text-sm text-[#737373] hover:text-[#1d4ed8]"
            href="https://github.com/Kareena2070/judgr"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="border-t border-[#e5e5e0] px-4 py-5 text-center text-xs text-[#737373] sm:px-6">
        © {new Date().getFullYear()} Judgr. Built for better hackathons.
      </div>
    </footer>
  );
}
