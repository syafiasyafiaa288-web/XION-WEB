import { list } from '@vercel/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const { slug, path } = params;
  const requested = path && path.length ? path.join('/') : 'index.html';

  const candidates = [
    `sites/${slug}/${requested}`,
    `sites/${slug}/${requested}/index.html`,
    `sites/${slug}/${requested}.html`,
    `sites/${slug}/index.html`, // SPA fallback
  ];

  let blob = null;
  for (const cand of candidates) {
    const { blobs } = await list({ prefix: cand, limit: 20 });
    const found = blobs.find((b) => b.pathname === cand);
    if (found) { blob = found; break; }
  }

  if (!blob) {
    return new Response(
      `<!doctype html><meta charset="utf-8"><h1>404</h1>
       <p>File <code>${escapeHtml(requested)}</code> tidak ditemukan di site <b>${escapeHtml(slug)}</b>.</p>`,
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const upstream = await fetch(blob.url);
  if (!upstream.ok) {
    return new Response('Gagal mengambil file dari storage', { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': blob.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}