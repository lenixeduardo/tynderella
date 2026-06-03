export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center">
      <div className="absolute inset-0 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl" />
      <nav className="relative max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <a
          href="/"
          className="text-white font-semibold tracking-[-0.03em] text-lg select-none"
        >
          tynderella
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {[
            { label: "Discover",      href: "#discover"      },
            { label: "Collections",   href: "#featured"      },
            { label: "How it works",  href: "#how-it-works"  },
          ].map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#join"
          className="hidden md:inline-flex h-9 items-center rounded-full bg-rose-500 px-5 text-sm font-medium text-white hover:bg-rose-400 active:scale-[0.98] transition-all duration-200"
        >
          Get started
        </a>

        {/* Mobile: just show CTA */}
        <a
          href="#join"
          className="md:hidden inline-flex h-9 items-center rounded-full bg-rose-500 px-4 text-sm font-medium text-white"
        >
          Get started
        </a>
      </nav>
    </header>
  );
}
