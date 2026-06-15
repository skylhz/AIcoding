import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** GET /api/admin/orders — 所有订单列表 */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: { product: { select: { images: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("获取订单列表失败:", error);
    return NextResponse.json({ error: "获取订单列表失败" }, { status: 500 });
  }
}
