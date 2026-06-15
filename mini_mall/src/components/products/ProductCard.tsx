import Link from "next/link";

/** 商品数据类型 */
interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  images: string;
  category: { name: string; slug: string };
}

/**
 * 商品卡片组件
 * 展示商品缩略图、名称、价格和分类标签
 */
/** 安全解析商品图片 JSON 字符串 */
function parseImages(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default function ProductCard({ product }: { product: ProductCardProps }) {
  const images = parseImages(product.images);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 商品图片 */}
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            暂无图片
          </div>
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
          {product.category.name}
        </span>
        <h3 className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-red-600">
          ¥{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
