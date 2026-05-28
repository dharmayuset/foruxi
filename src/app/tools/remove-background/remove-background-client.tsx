'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Download, RefreshCcw } from 'lucide-react';
import { FileDropzone } from '@/components/file-dropzone';
import { downloadBlob } from '@/lib/download';
import { loadImgly } from '@/lib/imgly-loader';
import { formatBytes } from '@/lib/utils';

type Status = 'idle' | 'loading-model' | 'processing' | 'done' | 'error';

export function RemoveBackgroundClient() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // revoke object URLs on unmount / when files change
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reset() {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setOriginalUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
  }

  async function pickFile(files: File[]) {
    setError(null);
    const f = files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, WebP).');
      return;
    }
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setResultBlob(null);
    setResultUrl(null);

    try {
      setStatus('loading-model');
      setProgress(0);
      // Loaded from CDN at runtime — see lib/imgly-loader.ts for why.
      const { removeBackground } = await loadImgly();
      setStatus('processing');
      const blob = await removeBackground(f, {
        progress: (_key, current, total) => {
          if (total > 0) setProgress(Math.round((current / total) * 100));
        },
      });
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      setStatus('done');
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to remove background. Try a different image.',
      );
      setStatus('error');
    }
  }

  function handleDownload() {
    if (!resultBlob || !file) return;
    const base = file.name.replace(/\.[^.]+$/, '');
    downloadBlob(resultBlob, `${base}-no-bg.png`);
  }

  const showProgress = status === 'loading-model' || status === 'processing';

  return (
    <div className="space-y-6">
      {!file && (
        <FileDropzone
          accept="image/png,image/jpeg,image/webp"
          onFiles={pickFile}
          hint="Runs entirely in your browser. PNG, JPG or WebP."
        />
      )}

      {file && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Preview label="Original" src={originalUrl} />
            <Preview
              label="Background removed"
              src={resultUrl}
              checkered
              loading={showProgress}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                New image
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!resultBlob}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Download PNG
              </button>
            </div>
          </div>
        </>
      )}

      {showProgress && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            {status === 'loading-model'
              ? 'Loading background-removal model…'
              : 'Removing background…'}
            {progress > 0 && <span className="ml-auto font-medium">{progress}%</span>}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-brand-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <p className="text-xs text-slate-500">
        Privacy: your image is processed locally in your browser using ONNX. It is never
        uploaded to a server.
      </p>
    </div>
  );
}

function Preview({
  label,
  src,
  checkered,
  loading,
}: {
  label: string;
  src: string | null;
  checkered?: boolean;
  loading?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">{label}</p>
      <div
        className={
          'relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 ' +
          (checkered ? 'bg-checkered' : 'bg-slate-50')
        }
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={label} className="max-h-full max-w-full object-contain" />
        ) : loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        ) : (
          <span className="text-xs text-slate-400">No image yet</span>
        )}
      </div>
    </div>
  );
}
