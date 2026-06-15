import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseImages, formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/cart/AddToCartButton";

/** 商品详情页：大图 + 名称/价格/描述/库存 + 加入购物车按钮 */
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!product) {
    notFound();
  }

  const images = parseImages(product.images);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              首页
            </Link>
            <span>/</span>
            <Link
              href={`/?category=${product.category.slug}`}
              className="hover:text-blue-600 transition-colors"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* 左侧：商品图片 */}
            <div className="space-y-4">
              {/* 主图 */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                    暂无图片
                  </div>
                )}
              </div>

              {/* 缩略图列表 */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer transition-colors"
                    >
                      <img
                        src={img}
                        alt={`${product.name} - 图片${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧：商品信息 */}
            <div className="flex flex-col">
              {/* 分类标签 */}
              <Link
                href={`/?category=${product.category.slug}`}
                className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit hover:bg-blue-100 transition-colors"
              >
                {product.category.name}
              </Link>

              {/* 商品名称 */}
              <h1 className="mt-4 text-2xl font-bold text-gray-900">
                {product.name}
              </h1>

              {/* 价格 */}
              <div className="mt-6 bg-red-50 rounded-lg p-4">
                <span className="text-3xl font-bold text-red-600">
                  ¥{formatPrice(product.price)}
                </span>
              </div>

              {/* 库存信息 */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                {product.stock > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-green-700">有货</span>
                    <span className="text-gray-400">（库存 {product.stock} 件）</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-red-700">暂时缺货</span>
                  </>
                )}
              </div>

              {/* 商品描述 */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">商品描述</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="mt-auto pt-8 flex gap-3">
                <AddToCartButton
                  productId={product.id}
                  disabled={product.stock === 0}
                />
                <Link
                  href="/"
                  className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  继续购物
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
