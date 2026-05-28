import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { Tool } from '@/lib/tools';

export function ToolPageHeader({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <div className="border-b border-slate-200 bg-slate-50/60">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to all tools
        </Link>
        <div className="mt-4 flex items-start gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-6 w-6" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{tool.title}</h1>
            <p className="mt-1 max-w-2xl text-slate-600">{tool.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
