import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-slate-900">
            for<span className="text-brand-500">u</span>xi
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#pdf" className="hover:text-slate-900">
            PDF
          </Link>
          <Link href="/#convert" className="hover:text-slate-900">
            Convert
          </Link>
          <Link href="/#image" className="hover:text-slate-900">
            Image
          </Link>
          <Link href="/#ocr" className="hover:text-slate-900">
            OCR
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#tools"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            All tools
          </Link>
        </div>
      </div>
    </header>
  );
}
