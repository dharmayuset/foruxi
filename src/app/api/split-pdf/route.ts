import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';
import { parsePageRanges } from '@/lib/page-ranges';
import { toBodyArrayBuffer } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/split-pdf
 * Body: multipart/form-data with:
 *   - file: a single PDF
 *   - ranges: string e.g. "1, 3-5, 8"
 * Returns: a single PDF containing exactly the selected pages, in the order given.
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    const ranges = String(form.get('ranges') ?? '').trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No PDF file uploaded.' }, { status: 400 });
    }
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF.' }, { status: 400 });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const total = src.getPageCount();

    let selected: number[];
    try {
      selected = parsePageRanges(ranges, total);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : 'Invalid page range.' },
        { status: 400 },
      );
    }

    const out = await PDFDocument.create();
    // pdf-lib uses 0-indexed page indices.
    const pages = await out.copyPages(
      src,
      selected.map((p) => p - 1),
    );
    pages.forEach((p) => out.addPage(p));

    const data = await out.save();
    return new NextResponse(toBodyArrayBuffer(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="foruxi-split.pdf"',
      },
    });
  } catch (err) {
    console.error('[split-pdf] error', err);
    const message = err instanceof Error ? err.message : 'Failed to split PDF.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
