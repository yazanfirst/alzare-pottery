import { NextResponse } from 'next/server';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '@/lib/data';
import { isAuthenticated } from '@/lib/auth';
import { Product } from '@/types';
import { getAdminDisabledMessage, isAdminAccessEnabled } from '@/lib/adminAccess';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const product = getProductById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product });
  }

  const products = getProducts();
  return NextResponse.json({ products });
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
    const product: Product = await request.json();
    addProduct(product);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
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
    updateProduct(id, updates);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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
    deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
