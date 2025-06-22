import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('[API] Full request body:', body);

    const uid = body?.uid;
    if (!uid) {
      console.error('[API] UID missing from request body');
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    await adminAuth.deleteUser(uid);
    console.log('[API] Successfully deleted UID:', uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE AUTH USER error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
