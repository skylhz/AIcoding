import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

/** 新建商品页 */
export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">新增商品</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
