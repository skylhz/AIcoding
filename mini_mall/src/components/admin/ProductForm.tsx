"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

/** 分类选项 */
interface CategoryOption {
  id: number;
  name: string;
}

/** 商品表单（新建/编辑共用） */
export default function ProductForm({
  initialData,
  categories,
}: {
  initialData?: {
    id?: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string;
    isFeatured: boolean;
    categoryId: number;
  };
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const isEdit = !!initialData?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      name: form.get("name"),
      slug: form.get("slug"),
      description: form.get("description"),
      price: parseInt(form.get("price") as string, 10),
      stock: parseInt(form.get("stock") as string, 10),
      images: form.get("images") || "[]",
      isFeatured: form.get("isFeatured") === "on",
      categoryId: parseInt(form.get("categoryId") as string, 10),
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        const j = await res.json();
        setError(j.error || "保存失败");
      }
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4 max-w-2xl">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">商品名称 *</label>
          <input name="name" defaultValue={initialData?.name} required className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL 标识 *</label>
          <input name="slug" defaultValue={initialData?.slug} required className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">描述 *</label>
        <textarea name="description" defaultValue={initialData?.description} required rows={4} className="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">价格（分）*</label>
          <input name="price" type="number" defaultValue={initialData?.price} required className="w-full px-3 py-2 border rounded-lg text-sm" />
          {initialData?.price != null && (
            <p className="text-xs text-gray-400 mt-1">当前：¥{formatPrice(initialData.price)}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">库存</label>
          <input name="stock" type="number" defaultValue={initialData?.stock ?? 0} className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
          <select name="categoryId" defaultValue={initialData?.categoryId} required className="w-full px-3 py-2 border rounded-lg text-sm">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">图片（JSON数组）</label>
        <input name="images" defaultValue={initialData?.images || "[]"} className="w-full px-3 py-2 border rounded-lg text-sm" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured} />
        首页推荐
      </label>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 text-sm font-medium">
          {loading ? "保存中..." : isEdit ? "保存修改" : "创建商品"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded-lg text-sm hover:bg-gray-50">
          取消
        </button>
      </div>
    </form>
  );
}
