import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

/**
 * Resolve the LibreOffice binary. In Docker (see docker/Dockerfile) we install
 * `libreoffice`, which provides `soffice`. Override via env if needed.
 */
const SOFFICE_BIN = process.env.SOFFICE_BIN ?? 'soffice';

/** Default conversion timeout (ms). */
const TIMEOUT_MS = Number(process.env.SOFFICE_TIMEOUT_MS ?? 60_000);

/**
 * Convert a document buffer to PDF using a headless LibreOffice process.
 *
 * - Writes input to a temp dir (LibreOffice cannot read from stdin reliably).
 * - Runs `soffice --headless --convert-to pdf --outdir <tmp> <input>`.
 * - Reads back the produced PDF and removes the temp dir.
 *
 * @throws Error if LibreOffice is not installed, exits non-zero, or times out.
 */
export async function convertToPdf(input: Buffer, originalName: string): Promise<Buffer> {
  const dir = await mkdtemp(path.join(tmpdir(), 'foruxi-'));
  // Sanitize input filename: keep extension only, randomize stem.
  const ext = path.extname(originalName) || '.docx';
  const stem = `input-${Date.now()}`;
  const inPath = path.join(dir, `${stem}${ext}`);
  const outPath = path.join(dir, `${stem}.pdf`);

  try {
    await writeFile(inPath, input);

    await new Promise<void>((resolve, reject) => {
      const proc = spawn(
        SOFFICE_BIN,
        [
          '--headless',
          '--norestore',
          '--nolockcheck',
          '--nodefault',
          '--nofirststartwizard',
          '--convert-to',
          'pdf',
          '--outdir',
          dir,
          inPath,
        ],
        { stdio: ['ignore', 'pipe', 'pipe'] },
      );

      const killTimer = setTimeout(() => {
        proc.kill('SIGKILL');
        reject(new Error('LibreOffice conversion timed out.'));
      }, TIMEOUT_MS);

      let stderr = '';
      proc.stderr.on('data', (d) => {
        stderr += d.toString();
      });

      proc.on('error', (err) => {
        clearTimeout(killTimer);
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
          reject(
            new Error(
              'LibreOffice is not installed on this server. See docker/Dockerfile for the production setup.',
            ),
          );
        } else {
          reject(err);
        }
      });

      proc.on('close', (code) => {
        clearTimeout(killTimer);
        if (code === 0) resolve();
        else reject(new Error(`LibreOffice exited with code ${code}. ${stderr}`.trim()));
      });
    });

    return await readFile(outPath);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
