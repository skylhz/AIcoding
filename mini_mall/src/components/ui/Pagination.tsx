import Link from "next/link";
import { buildHomeUrl } from "@/lib/url";

/**
 * 分页组件
 * 传入当前页、总页数、当前搜索/分类参数，生成页码链接
 */
export default function Pagination({
  page,
  totalPages,
  search,
  category,
}: {
  page: number;
  totalPages: number;
  search: string;
  category: string;
}) {
  if (totalPages <= 1) return null;

  // 生成页码数组（带省略号）
  const pages: (number | "...")[] = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* 上一页 */}
      {page > 1 && (
        <Link
          href={buildHomeUrl({ search, category, page: page - 1 })}
          className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
        >
          上一页
        </Link>
      )}

      {/* 页码 */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHomeUrl({ search, category, page: p })}
            className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
              p === page
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-50"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* 下一页 */}
      {page < totalPages && (
        <Link
          href={buildHomeUrl({ search, category, page: page + 1 })}
          className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
        >
          下一页
        </Link>
      )}
    </div>
  );
}
