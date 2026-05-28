'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Trash2, Loader2 } from 'lucide-react';
import { FileDropzone } from '@/components/file-dropzone';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/utils';

export function MergePdfClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(incoming: File[]) {
    setError(null);
    setFiles((prev) => [...prev, ...incoming.filter((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))]);
  }

  function move(idx: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  }

  function remove(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleMerge() {
    if (files.length < 2) {
      setError('Please add at least two PDF files.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('files', f));
      const res = await fetch('/api/merge-pdf', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `Merge failed (${res.status})`);
      }
      const blob = await res.blob();
      downloadBlob(blob, 'foruxi-merged.pdf');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="application/pdf"
        multiple
        onFiles={addFiles}
        hint="Add 2 or more PDFs. You can reorder them below."
      />

      {files.length > 0 && (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-3 px-4 py-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">{f.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(f.size)}</p>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <button
                  aria-label="Move up"
                  className="rounded-md p-1.5 hover:bg-slate-100 disabled:opacity-30"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  aria-label="Move down"
                  className="rounded-md p-1.5 hover:bg-slate-100 disabled:opacity-30"
                  onClick={() => move(i, 1)}
                  disabled={i === files.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  aria-label="Remove"
                  className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-600"
                  onClick={() => remove(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        {files.length > 0 && (
          <button
            type="button"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
            onClick={() => setFiles([])}
            disabled={busy}
          >
            Clear all
          </button>
        )}
        <button
          type="button"
          onClick={handleMerge}
          disabled={busy || files.length < 2}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {busy ? 'Merging…' : 'Merge PDFs'}
        </button>
      </div>
    </div>
  );
}
