import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

/** 商品管理列表页 */
export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const search = typeof sp.search === "string" ? sp.search : "";
  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10));
  const pageSize = 10;

  const where = search ? { name: { contains: search } } : {};
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          + 新增商品
        </Link>
      </div>

      {/* 搜索 */}
      <form className="mb-4 flex gap-2">
        <input
          name="search"
          defaultValue={search}
          placeholder="搜索商品..."
          className="px-3 py-1.5 border rounded-lg text-sm w-64"
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-gray-100 text-sm rounded-lg hover:bg-gray-200"
        >
          搜索
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">商品</th>
              <th className="text-left px-4 py-3">分类</th>
              <th className="text-right px-4 py-3">价格</th>
              <th className="text-right px-4 py-3">库存</th>
              <th className="text-right px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category.name}</td>
                <td className="px-4 py-3 text-right">¥{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-right">{p.stock}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    编辑
                  </Link>
                  <DeleteProductButton id={p.id} name={p.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/products?page=${p}${search ? `&search=${search}` : ""}`}
              className={`px-3 py-1 text-sm border rounded ${
                p === page ? "bg-blue-600 text-white" : "hover:bg-gray-50"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
