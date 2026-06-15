import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

/** 编辑商品页 */
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id, 10) },
    include: { category: { select: { id: true, name: true } } },
  });

  if (!product) notFound();

  const categories = await prisma.category.findMany({ select: { id: true, name: true } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">编辑商品</h1>
      <ProductForm
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          images: product.images,
          isFeatured: product.isFeatured,
          categoryId: product.categoryId,
        }}
        categories={categories}
      />
    </div>
  );
}
