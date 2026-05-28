import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { ToolPageHeader } from '@/components/tool-page-header';
import { getToolBySlug } from '@/lib/tools';

// The bg-removal client uses the ONNX runtime, which is browser-only. Disabling
// SSR keeps the heavy WebGPU/WASM code out of the server bundle entirely.
const RemoveBackgroundClient = dynamic(
  () => import('./remove-background-client').then((m) => m.RemoveBackgroundClient),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Loading background-removal tool…
      </div>
    ),
  },
);

export default function RemoveBackgroundPage() {
  const tool = getToolBySlug('remove-background');
  if (!tool) notFound();

  return (
    <>
      <ToolPageHeader tool={tool} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <RemoveBackgroundClient />
      </div>
    </>
  );
}
