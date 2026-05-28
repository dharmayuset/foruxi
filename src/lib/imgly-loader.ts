/**
 * The @imgly/background-removal library bundles the ONNX runtime, which ships
 * a giant minified ESM that breaks Next.js's SWC-based bundler. To sidestep
 * the entire problem we load it at runtime from a public CDN.
 *
 * The `/* webpackIgnore: true *​/` magic comment tells webpack to leave this
 * import alone — the browser resolves the URL itself when the user actually
 * clicks "Remove background". Nothing related to ONNX is ever bundled.
 */

// Pinned to a known-good version. Bump deliberately when upgrading.
const CDN_URL = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.5/+esm';

export interface ImglyProgress {
  (key: string, current: number, total: number): void;
}

export interface ImglyConfig {
  progress?: ImglyProgress;
}

interface ImglyModule {
  removeBackground: (
    image: Blob | File | string,
    config?: ImglyConfig,
  ) => Promise<Blob>;
}

let cached: Promise<ImglyModule> | null = null;

/** Load the background-removal module once and cache it for subsequent calls. */
export function loadImgly(): Promise<ImglyModule> {
  if (cached) return cached;
  cached = import(/* webpackIgnore: true */ CDN_URL) as Promise<ImglyModule>;
  return cached;
}
