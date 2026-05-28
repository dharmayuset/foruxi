import {
  FileText,
  Scissors,
  Combine,
  FileDown,
  ImageDown,
  Eraser,
  ImagePlus,
  ScanText,
  type LucideIcon,
} from 'lucide-react';

export type ToolStatus = 'ready' | 'soon';

export type ToolCategory = 'pdf' | 'convert' | 'image' | 'ocr';

export interface Tool {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  status: ToolStatus;
  href: string;
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  pdf: 'Organize PDF',
  convert: 'Convert',
  image: 'Image Tools',
  ocr: 'OCR',
};

export const tools: Tool[] = [
  {
    slug: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into a single document, in the order you choose.',
    icon: Combine,
    category: 'pdf',
    status: 'ready',
    href: '/tools/merge-pdf',
  },
  {
    slug: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract one or more pages from a PDF, or split into multiple files.',
    icon: Scissors,
    category: 'pdf',
    status: 'ready',
    href: '/tools/split-pdf',
  },
  {
    slug: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while keeping the best quality possible.',
    icon: FileDown,
    category: 'pdf',
    status: 'soon',
    href: '/tools/compress-pdf',
  },
  {
    slug: 'docx-to-pdf',
    title: 'Word to PDF',
    description: 'Convert DOCX documents to PDF with high fidelity using LibreOffice.',
    icon: FileText,
    category: 'convert',
    status: 'ready',
    href: '/tools/docx-to-pdf',
  },
  {
    slug: 'pdf-to-docx',
    title: 'PDF to Word',
    description: 'Convert PDF documents to editable DOCX files.',
    icon: FileText,
    category: 'convert',
    status: 'soon',
    href: '/tools/pdf-to-docx',
  },
  {
    slug: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Turn JPG / PNG images into a single PDF document.',
    icon: ImagePlus,
    category: 'convert',
    status: 'soon',
    href: '/tools/image-to-pdf',
  },
  {
    slug: 'remove-background',
    title: 'Remove Background',
    description: 'Erase image backgrounds in your browser. Your files never leave your device.',
    icon: Eraser,
    category: 'image',
    status: 'ready',
    href: '/tools/remove-background',
  },
  {
    slug: 'compress-image',
    title: 'Compress Image',
    description: 'Reduce JPG / PNG / WebP size while preserving visual quality.',
    icon: ImageDown,
    category: 'image',
    status: 'soon',
    href: '/tools/compress-image',
  },
  {
    slug: 'ocr',
    title: 'OCR (Image to Text)',
    description: 'Extract text from images and scanned PDFs using Tesseract.',
    icon: ScanText,
    category: 'ocr',
    status: 'soon',
    href: '/tools/ocr',
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}
