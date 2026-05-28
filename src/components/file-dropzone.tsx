'use client';

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
  className?: string;
}

export function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  hint,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const arr = Array.from(list);
      onFiles(multiple ? arr : [arr[0]]);
    },
    [multiple, onFiles],
  );

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset so same file can be picked again
    e.target.value = '';
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-10 text-center transition',
        isOver
          ? 'border-brand-500 bg-brand-50/60'
          : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50',
        className,
      )}
    >
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Upload className="h-6 w-6" />
      </div>
      <p className="text-base font-semibold text-slate-900">
        Drop {multiple ? 'files' : 'file'} here, or{' '}
        <span className="text-brand-600">browse</span>
      </p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}
