import { Suspense } from "react";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/ProductCard";
import SearchBar from "@/components/products/SearchBar";
import CategoryTabs from "@/components/products/CategoryTabs";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 9;

/** 首页：商品网格 + 搜索 + 分类筛选 + 分页 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10));

  // 构建查询条件（使用 Prisma 类型确保类型安全）
  const where: Prisma.ProductWhereInput = {};
  if (search) where.name = { contains: search };
  if (category) where.category = { slug: category };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 顶部横幅 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold">Mini Mall</h1>
          <p className="mt-2 text-blue-100">发现好物，享受购物乐趣</p>

          {/* 搜索框 */}
          <div className="mt-6 max-w-xl">
            <Suspense>
              <SearchBar />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 分类标签 */}
        <section className="mb-8">
          <CategoryTabs
            categories={categories.map((c) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              _count: c._count,
            }))}
            activeSlug={category}
            search={search}
          />
        </section>

        {/* 商品列表 */}
        <section>
          {products.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                共找到 {total} 件商品
                {search && `，搜索"${search}"`}
                {category &&
                  `，分类"${
                    categories.find((c) => c.slug === category)?.name || category
                  }"`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">没有找到相关商品</p>
              <p className="text-gray-400 text-sm mt-2">试试其他搜索词或分类</p>
            </div>
          )}
        </section>

        {/* 分页 */}
        <Pagination
          page={page}
          totalPages={totalPages}
          search={search}
          category={category}
        />
      </div>
    </main>
  );
}
