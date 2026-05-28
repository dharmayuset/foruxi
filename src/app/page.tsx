import { ToolCard } from '@/components/tool-card';
import { CATEGORY_LABELS, tools, type ToolCategory } from '@/lib/tools';

const CATEGORY_ORDER: ToolCategory[] = ['pdf', 'convert', 'image', 'ocr'];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dots border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <h1 className="mx-auto max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Every document tool you need.{' '}
            <span className="text-brand-500">In one place.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Merge, split, convert, and edit PDFs and images. Self-hosted, fast, and free —
            your files never leave your server.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="#tools"
              className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
            >
              Browse all tools
            </a>
            <a
              href="https://github.com/dharmayuset/foruxi"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Tools grid by category */}
      <section id="tools" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {CATEGORY_ORDER.map((cat) => {
          const list = tools.filter((t) => t.category === cat);
          if (!list.length) return null;
          return (
            <div key={cat} id={cat} className="mb-14 scroll-mt-24 last:mb-0">
              <div className="mb-6 flex items-end justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {CATEGORY_LABELS[cat]}
                </h2>
                <span className="text-sm text-slate-500">{list.length} tools</span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
