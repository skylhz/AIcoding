import { prisma } from "@/lib/prisma";
import CategoryManager from "@/components/admin/CategoryManager";

/** 分类管理页 */
export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">分类管理</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
