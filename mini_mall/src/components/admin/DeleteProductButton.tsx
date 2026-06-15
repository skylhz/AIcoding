"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** 删除商品按钮（需确认） */
export default function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`确认删除商品"${name}"？此操作不可撤销。`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("删除失败");
      }
    } catch {
      alert("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:underline disabled:text-gray-300"
    >
      {loading ? "删除中..." : "删除"}
    </button>
  );
}
