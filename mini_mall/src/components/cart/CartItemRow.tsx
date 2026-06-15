"use client";

import { updateCartItem, removeCartItem } from "@/lib/cart-actions";
import { parseImages, formatPrice } from "@/lib/utils";

/** 购物车单项数据类型 */
interface CartItemData {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    images: string;
  };
}

/**
 * 购物车单项行
 * 显示商品图片/名称/单价，提供数量增减和删除操作
 */
export default function CartItemRow({ item }: { item: CartItemData }) {
  const images = parseImages(item.product.images);
  const subtotal = (item.product.price / 100) * item.quantity;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100">
      {/* 商品图片 */}
      <img
        src={images[0] || "https://placehold.co/80x80/e5e7eb/9ca3af?text=无图"}
        alt={item.product.name}
        className="w-20 h-20 object-cover rounded-lg bg-gray-100"
      />

      {/* 商品信息 */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          单价 ¥{formatPrice(item.product.price)}
        </p>
        <p className="mt-1 text-sm font-medium text-red-600">
          小计 ¥{formatPrice(item.product.price * item.quantity)}
        </p>
      </div>

      {/* 数量控制 */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateCartItem(item.id, item.quantity - 1)}
          className="w-7 h-7 flex items-center justify-center border rounded text-gray-500 hover:bg-gray-50 text-sm"
        >
          −
        </button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => updateCartItem(item.id, item.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center border rounded text-gray-500 hover:bg-gray-50 text-sm"
        >
          +
        </button>
      </div>

      {/* 删除按钮 */}
      <button
        onClick={() => removeCartItem(item.id)}
        className="text-sm text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
      >
        删除
      </button>
    </div>
  );
}
