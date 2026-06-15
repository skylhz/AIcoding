import Link from "next/link";
import { buildHomeUrl } from "@/lib/url";

/** 分类数据类型 */
interface CategoryTab {
  id: number;
  name: string;
  slug: string;
  _count: { products: number };
}

/**
 * 分类标签切换组件
 * 点击标签按分类筛选商品
 */
export default function CategoryTabs({
  categories,
  activeSlug,
  search,
}: {
  categories: CategoryTab[];
  activeSlug: string;
  search: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* "全部"标签 */}
      <Link
        href={buildHomeUrl({ search })}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
          !activeSlug
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={buildHomeUrl({ search, category: cat.slug })}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeSlug === cat.slug
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.name}
          <span className="ml-1 opacity-70">({cat._count.products})</span>
        </Link>
      ))}
    </div>
  );
}
