'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { FileDropzone } from '@/components/file-dropzone';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/utils';

export function DocxToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickFile(files: File[]) {
    setError(null);
    setFile(files[0] ?? null);
  }

  async function handleConvert() {
    if (!file) {
      setError('Please choose a document.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/docx-to-pdf', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Conversion failed (${res.status})`);
      }
      const blob = await res.blob();
      const outName = file.name.replace(/\.[^.]+$/, '') + '.pdf';
      downloadBlob(blob, outName);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept=".doc,.docx,.odt,.rtf,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onFiles={pickFile}
          hint="Supported: DOC, DOCX, ODT, RTF, TXT"
        />
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Replace
          </button>
        </div>
      )}

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
        <strong>Self-hosted note:</strong> conversion runs through LibreOffice on your server.
        See <code>docker/Dockerfile</code> for a ready-to-deploy image.
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleConvert}
          disabled={busy || !file}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? 'Converting…' : 'Convert to PDF'}
        </button>
      </div>
    </div>
  );
}
