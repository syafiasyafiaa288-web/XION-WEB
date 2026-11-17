import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { slug, siteName, files } = await req.json();
    if (!slug || !Array.isArray(files)) {
      return NextResponse.json({ error: 'Payload invalid' }, { status: 400 });
    }

    const meta = {
      slug,
      siteName: siteName || slug,
      files,
      createdAt: new Date().toISOString(),
    };

    await put(`sites-meta/${slug}.json`, JSON.stringify(meta), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error('[finalize]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}