import { NextResponse } from 'next/server';
import { getCoupons, getCouponByCode, addCoupon, updateCoupon, deleteCoupon } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { Coupon } from '@/types';
import { getAdminDisabledMessage, isAdminAccessEnabled } from '@/lib/adminAccess';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const coupon = getCouponByCode(code);
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);

    if (!coupon.active) {
      return NextResponse.json({ error: 'Coupon is not active' }, { status: 400 });
    }

    if (now < startDate || now > endDate) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    return NextResponse.json({ coupon });
  }

  if (!isAdminAccessEnabled()) {
    return NextResponse.json({ error: getAdminDisabledMessage() }, { status: 404 });
  }

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const coupons = getCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(request: Request) {
  if (!isAdminAccessEnabled()) {
    return NextResponse.json({ error: getAdminDisabledMessage() }, { status: 404 });
  }

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const coupon: Coupon = await request.json();
    addCoupon(coupon);
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdminAccessEnabled()) {
    return NextResponse.json({ error: getAdminDisabledMessage() }, { status: 404 });
  }

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await request.json();
    updateCoupon(id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAdminAccessEnabled()) {
    return NextResponse.json({ error: getAdminDisabledMessage() }, { status: 404 });
  }

  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await request.json();
    deleteCoupon(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
