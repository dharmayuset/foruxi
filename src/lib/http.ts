/**
 * Convert a Node Buffer / Uint8Array into a fresh ArrayBuffer suitable for
 * use as a `BodyInit` in `Response`/`NextResponse`. Necessary because recent
 * `@types/node` types Buffer as `Buffer<ArrayBufferLike>`, which the DOM
 * `BodyInit` type does not accept.
 *
 * Cost: one O(n) copy. For PDFs in the tens of MB this is negligible.
 */
export function toBodyArrayBuffer(input: Uint8Array | Buffer): ArrayBuffer {
  const out = new ArrayBuffer(input.byteLength);
  new Uint8Array(out).set(input);
  return out;
}
