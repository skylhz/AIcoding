import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/** PUT /api/admin/categories/[id] — 更新分类 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const { name, slug, description, image } = await request.json();
    const category = await prisma.category.update({
      where: { id: parseInt(id, 10) },
      data: { name, slug, description, image },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error("更新分类失败:", error);
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 });
  }
}

/** DELETE /api/admin/categories/[id] — 删除分类 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除分类失败:", error);
    return NextResponse.json({ error: "删除分类失败，可能存在关联商品" }, { status: 500 });
  }
}
