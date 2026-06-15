import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/** POST /api/admin/categories — 创建分类 */
export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const { name, slug, description, image } = await request.json();
    if (!name || !slug) {
      return NextResponse.json({ error: "名称和标识不能为空" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, slug, description: description || null, image: image || null },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("创建分类失败:", error);
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 });
  }
}
