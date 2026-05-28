import { notFound } from 'next/navigation';
import { ToolPageHeader } from '@/components/tool-page-header';
import { getToolBySlug } from '@/lib/tools';
import { DocxToPdfClient } from './docx-to-pdf-client';

export default function DocxToPdfPage() {
  const tool = getToolBySlug('docx-to-pdf');
  if (!tool) notFound();

  return (
    <>
      <ToolPageHeader tool={tool} />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <DocxToPdfClient />
      </div>
    </>
  );
}
