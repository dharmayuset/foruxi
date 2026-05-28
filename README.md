# foruxi

> Free, self-hosted document tools — like iLovePDF, but yours.

**foruxi** is a privacy-first, self-hostable web app that bundles common PDF and image
utilities (merge, split, convert, background removal, OCR…) into a single clean
interface. Files are processed on your own server (or in your browser) — never on a
third-party SaaS.

---

## Features

| Category | Tool                  | Status     | Where it runs        |
|----------|-----------------------|------------|----------------------|
| PDF      | Merge PDF             | Ready      | Server (`pdf-lib`)   |
| PDF      | Split PDF             | Ready      | Server (`pdf-lib`)   |
| PDF      | Compress PDF          | Roadmap    | Server (Ghostscript) |
| Convert  | Word → PDF (DOCX/etc) | Ready      | Server (LibreOffice) |
| Convert  | PDF → Word            | Roadmap    | Server (LibreOffice) |
| Convert  | Image → PDF           | Roadmap    | Server (`pdf-lib`)   |
| Image    | Remove Background     | Ready      | **Browser** (ONNX)   |
| Image    | Compress Image        | Roadmap    | Server (`sharp`)     |
| OCR      | Image / PDF → Text    | Roadmap    | Browser (Tesseract)  |

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **pdf-lib** for PDF manipulation
- **LibreOffice (headless)** for document conversion
- **@imgly/background-removal** loaded from a CDN at runtime (browser-only)
- **lucide-react** for icons

---

## Quick start (local development)

```bash
git clone https://github.com/dharmayuset/foruxi.git
cd foruxi
npm install
npm run dev
```

Open <http://localhost:3000>.

> Note: the **Word → PDF** tool needs LibreOffice on your `PATH`. On macOS:
> `brew install --cask libreoffice`. On Ubuntu/Debian:
> `sudo apt install libreoffice`. Or just use Docker (below).

---

## Self-hosting with Docker

The included Dockerfile builds a production image that bundles LibreOffice and the
fonts needed for accurate DOCX rendering.

```bash
# from the repo root
docker build -f docker/Dockerfile -t foruxi:latest .
docker run --rm -p 3000:3000 foruxi:latest
```

Or with Compose:

```bash
docker compose -f docker/docker-compose.yml up --build
```

### Environment variables

| Variable             | Default     | Description                                       |
|----------------------|-------------|---------------------------------------------------|
| `SOFFICE_BIN`        | `soffice`   | Path to the LibreOffice binary.                   |
| `SOFFICE_TIMEOUT_MS` | `60000`     | Timeout (ms) for a single document conversion.    |

---

## Project layout

```
src/
  app/
    layout.tsx           # Root layout (header + footer)
    page.tsx             # Homepage with categorized tool grid
    tools/<slug>/        # One folder per tool (page + client component)
    api/<slug>/route.ts  # Server-side processing for that tool
  components/            # Header, Footer, FileDropzone, ToolCard, ...
  lib/
    tools.ts             # Single source of truth for the tool catalog
    libreoffice.ts       # Headless LibreOffice wrapper
    page-ranges.ts       # "1, 3-5, 8" parser for split/extract
    download.ts          # Browser download helper
    utils.ts             # cn(), formatBytes()
docker/
  Dockerfile             # Production image with LibreOffice
  docker-compose.yml
```

### Adding a new tool

1. Append an entry to `src/lib/tools.ts` (`status: 'ready'` to enable it).
2. Create `src/app/tools/<slug>/page.tsx` + a client component for the UI.
3. If it needs server processing, create `src/app/api/<slug>/route.ts`.
4. The homepage and category navigation pick it up automatically.

---

## Roadmap

- [ ] Compress PDF (Ghostscript)
- [ ] PDF → Word
- [ ] Image → PDF / PDF → Image
- [ ] Compress / convert image (sharp)
- [ ] OCR (Tesseract.js, browser)
- [ ] Per-IP rate limiting + auto-cleanup of temp files
- [ ] i18n (English first, Bahasa Indonesia next)

Contributions and issues welcome.
