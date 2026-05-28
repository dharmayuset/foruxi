export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900">
              for<span className="text-brand-500">u</span>xi
            </span>
            <span className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} &middot; Self-hosted document tools.
            </span>
          </div>
          <div className="text-sm text-slate-500">
            Open source &middot; Privacy-first &middot; No tracking
          </div>
        </div>
      </div>
    </footer>
  );
}
