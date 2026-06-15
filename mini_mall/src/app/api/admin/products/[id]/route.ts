import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/** PUT /api/admin/products/[id] — 更新商品 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ error: "无效ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, price, stock, images, isFeatured, categoryId } = body;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseInt(String(price), 10) }),
        ...(stock !== undefined && { stock: parseInt(String(stock), 10) }),
        ...(images !== undefined && { images }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(categoryId !== undefined && { categoryId: parseInt(String(categoryId), 10) }),
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error("更新商品失败:", error);
    return NextResponse.json({ error: "更新商品失败" }, { status: 500 });
  }
}

/** DELETE /api/admin/products/[id] — 删除商品 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  const productId = parseInt(id, 10);

  try {
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除商品失败:", error);
    return NextResponse.json({ error: "删除商品失败" }, { status: 500 });
  }
}
