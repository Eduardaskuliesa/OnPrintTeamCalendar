import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { path, secret } = body;

        
        if (secret !== process.env.REVALIDATE_SECRET_QUEUES) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        revalidatePath(path);
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err) {
        return NextResponse.json({ error: `Error revalidating ${err}` }, { status: 500 });
    }
}