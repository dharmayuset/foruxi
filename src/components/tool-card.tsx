import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Tool } from '@/lib/tools';

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const isSoon = tool.status === 'soon';

  return (
    <Link
      href={isSoon ? '#' : tool.href}
      aria-disabled={isSoon}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition',
        isSoon
          ? 'cursor-not-allowed opacity-60'
          : 'hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5',
      )}
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>

      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-slate-900">{tool.title}</h3>
        {isSoon && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            Soon
          </span>
        )}
      </div>

      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
        {tool.description}
      </p>

      {!isSoon && (
        <div className="mt-4 inline-flex items-center text-sm font-semibold text-brand-600 opacity-0 transition group-hover:opacity-100">
          Open tool
          <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      )}
    </Link>
  );
}
