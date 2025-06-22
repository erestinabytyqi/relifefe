import { NextResponse } from 'next/server';
import { adminAuth, adminDB } from '../../../lib/firebase-admin';

export async function POST(req) {
  try {
    const { email, role } = await req.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Missing email or role' }, { status: 400 });
    }

    const password = Math.random().toString(36).slice(-10);

    // 🔹 Create user
    const userRecord = await adminAuth.createUser({ email, password });

    // 🔹 Store role in Firestore
    await adminDB.collection('users').doc(userRecord.uid).set({
      email,
      role,
      createdAt: new Date(),
    });

    // 🔹 Send welcome email
    const emailRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-welcome-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const emailData = await emailRes.json();

    if (!emailRes.ok) {
      console.error('❌ Failed to send welcome email:', emailData);
      return NextResponse.json({ error: 'User created but email failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, password });
  } catch (error) {
    console.error('🔥 ERROR in /api/create-user:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown server error' },
      { status: 500 }
    );
  }
}
