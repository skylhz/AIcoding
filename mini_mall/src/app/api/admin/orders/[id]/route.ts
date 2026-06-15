import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/** PUT /api/admin/orders/[id] — 更新订单状态 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const { status } = await request.json();
    const order = await prisma.order.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("更新订单失败:", error);
    return NextResponse.json({ error: "更新订单失败" }, { status: 500 });
  }
}
