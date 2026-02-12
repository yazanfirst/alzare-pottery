import { NextResponse } from 'next/server';
import {
  verifyAdminPassword,
  generateAdminToken,
  setAdminCookie,
  clearAdminCookie,
  isAuthenticated,
} from '@/lib/auth';
import { getAdminDisabledMessage, isAdminAccessEnabled } from '@/lib/adminAccess';

export async function GET() {
  if (!isAdminAccessEnabled()) {
    return NextResponse.json({ error: getAdminDisabledMessage() }, { status: 404 });
  }

  const authenticated = await isAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  if (!isAdminAccessEnabled()) {
    return NextResponse.json({ error: getAdminDisabledMessage() }, { status: 404 });
  }

  try {
    const { password, action } = await request.json();

    if (action === 'logout') {
      await clearAdminCookie();
      return NextResponse.json({ success: true });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = generateAdminToken();
    await setAdminCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
