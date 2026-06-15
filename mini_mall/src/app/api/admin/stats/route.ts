import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** GET /api/admin/stats — 仪表盘统计数据 */
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }

  try {
    const [productCount, orderCount, userCount, totalRevenue] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    return NextResponse.json({
      productCount,
      orderCount,
      userCount,
      totalRevenue: totalRevenue._sum.total || 0,
    });
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return NextResponse.json({ error: "获取统计数据失败" }, { status: 500 });
  }
}
