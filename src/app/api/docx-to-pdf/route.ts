import { NextRequest, NextResponse } from 'next/server';
import { convertToPdf } from '@/lib/libreoffice';
import { toBodyArrayBuffer } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// LibreOffice can be slow on first run; give the route headroom.
export const maxDuration = 60;

const ALLOWED_EXT = ['.doc', '.docx', '.odt', '.rtf', '.txt'];

/**
 * POST /api/docx-to-pdf
 * Body: multipart/form-data with `file` (DOCX/DOC/ODT/RTF/TXT)
 * Returns: application/pdf
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }
    const lower = file.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      return NextResponse.json(
        { error: `Unsupported file type. Allowed: ${ALLOWED_EXT.join(', ')}.` },
        { status: 400 },
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const pdf = await convertToPdf(buf, file.name);

    const outName = file.name.replace(/\.[^.]+$/, '') + '.pdf';
    return new NextResponse(toBodyArrayBuffer(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${outName}"`,
      },
    });
  } catch (err) {
    console.error('[docx-to-pdf] error', err);
    const message = err instanceof Error ? err.message : 'Failed to convert document.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
