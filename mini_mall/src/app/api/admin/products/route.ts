import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** 管理员权限校验 */
async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return null;
  }
  return session;
}

/** POST /api/admin/products — 创建商品 */
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, price, stock, images, isFeatured, categoryId } = body;

    if (!name || !slug || !description || price == null || !categoryId) {
      return NextResponse.json({ error: "请填写所有必填字段" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(String(price), 10),
        stock: parseInt(String(stock), 10) || 0,
        images: images || "[]",
        isFeatured: Boolean(isFeatured),
        categoryId: parseInt(String(categoryId), 10),
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("创建商品失败:", error);
    return NextResponse.json({ error: "创建商品失败" }, { status: 500 });
  }
}
