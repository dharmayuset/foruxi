import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { toBodyArrayBuffer } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/merge-pdf
 * Body: multipart/form-data with field `files` (>=2 PDFs).
 * Returns: merged application/pdf
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll('files').filter((f): f is File => f instanceof File);

    if (files.length < 2) {
      return NextResponse.json(
        { error: 'Please upload at least two PDF files.' },
        { status: 400 },
      );
    }

    const merged = await PDFDocument.create();

    for (const file of files) {
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          { error: `"${file.name}" is not a PDF file.` },
          { status: 400 },
        );
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const out = await merged.save();
    return new NextResponse(toBodyArrayBuffer(out), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="foruxi-merged.pdf"',
      },
    });
  } catch (err) {
    console.error('[merge-pdf] error', err);
    const message = err instanceof Error ? err.message : 'Failed to merge PDFs.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
