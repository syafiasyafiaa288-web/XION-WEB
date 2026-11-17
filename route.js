import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        return {
          addRandomSuffix: false,
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB per file
          tokenPayload: clientPayload || '',
        };
      },
      onUploadCompleted: async () => {
        // no-op; metadata ditulis lewat /api/finalize
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error('[upload]', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}