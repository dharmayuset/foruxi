'use client';

import { useState } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { FileDropzone } from '@/components/file-dropzone';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/utils';

export function SplitPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickFile(files: File[]) {
    setError(null);
    setFile(files[0] ?? null);
  }

  async function handleSplit() {
    if (!file) {
      setError('Please choose a PDF.');
      return;
    }
    if (!ranges.trim()) {
      setError('Please enter the pages to extract, e.g. "1, 3-5, 8".');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('ranges', ranges);
      const res = await fetch('/api/split-pdf', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Split failed (${res.status})`);
      }
      const blob = await res.blob();
      downloadBlob(blob, `foruxi-split-${file.name.replace(/\.pdf$/i, '')}.pdf`);
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
          accept="application/pdf"
          onFiles={pickFile}
          hint="Choose a single PDF to split."
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
            onClick={() => {
              setFile(null);
              setRanges('');
            }}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            Replace
          </button>
        </div>
      )}

      <div>
        <label htmlFor="ranges" className="mb-1.5 block text-sm font-medium text-slate-700">
          Pages to extract
        </label>
        <input
          id="ranges"
          type="text"
          value={ranges}
          onChange={(e) => setRanges(e.target.value)}
          placeholder="e.g. 1, 3-5, 8"
          className="block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        <p className="mt-1.5 text-xs text-slate-500">
          Use commas for individual pages and dashes for ranges. Example: <code>1, 3-5, 8</code>
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSplit}
          disabled={busy || !file}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? 'Splitting…' : 'Extract pages'}
        </button>
      </div>
    </div>
  );
}
