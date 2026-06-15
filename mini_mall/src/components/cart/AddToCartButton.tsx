"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart-actions";

/**
 * 加入购物车按钮
 * 用于商品详情页，点击后调用 Server Action 加入购物车
 */
export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: number;
  disabled: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setLoading(true);
    setError("");
    try {
      await addToCart(productId, 1);
      router.push("/cart");
    } catch (e) {
      // Server Action redirect 会以 Error 形式抛出，需区分处理
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("NEXT_REDIRECT") || msg.includes("redirect")) {
        router.push("/login");
      } else {
        setError(msg || "添加失败，请稍后重试");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1">
      <button
        onClick={handleAdd}
        disabled={disabled || loading}
        className="w-full px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "正在添加..." : "加入购物车"}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
