import Link from "next/link";
import { formatPrice } from "@/lib/utils";

/**
 * 购物车底部汇总栏
 * 显示总价和结算按钮
 */
export default function CartSummary({
  total,
  itemCount,
}: {
  total: number; // 单位：分
  itemCount: number;
}) {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-sm text-gray-500">
          共 {itemCount} 件商品
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            合计：
            <span className="text-xl font-bold text-red-600">
              ¥{formatPrice(total)}
            </span>
          </span>
          <Link
            href="/checkout"
            className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            去结算
          </Link>
        </div>
      </div>
    </div>
  );
}
