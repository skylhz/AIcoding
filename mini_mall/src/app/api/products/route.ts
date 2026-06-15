import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// 每页商品数量
const PAGE_SIZE = 9;

/**
 * GET /api/products
 * 查询参数：
 *   - search: 模糊搜索商品名称
 *   - category: 按分类 slug 筛选
 *   - page: 页码（从 1 开始，默认 1）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  try {
    // 构建查询条件（使用 Prisma 类型确保类型安全）
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.name = { contains: search };
    }

    if (category) {
      where.category = { slug: category };
    }

    // 并行查询商品列表和总数
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { name: true, slug: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / PAGE_SIZE);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages,
      pageSize: PAGE_SIZE,
    });
  } catch (error) {
    console.error("获取商品列表失败:", error);
    return NextResponse.json({ error: "获取商品列表失败" }, { status: 500 });
  }
}
