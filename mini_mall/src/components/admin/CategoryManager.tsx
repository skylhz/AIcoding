"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
}

/** 分类管理（列表 + 新增 + 编辑 + 删除） */
export default function CategoryManager({ categories }: { categories: CategoryData[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        slug: form.get("slug"),
        description: form.get("description"),
      }),
    });
    if (res.ok) {
      router.refresh();
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        slug: form.get("slug"),
        description: form.get("description"),
      }),
    });
    if (res.ok) {
      setEditingId(null);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`确认删除分类"${name}"？`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("删除失败，可能存在关联商品");
  };

  return (
    <div className="space-y-6">
      {/* 新增表单 */}
      <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm p-4 flex gap-3 items-end">
        <div>
          <label className="block text-xs text-gray-500 mb-1">名称</label>
          <input name="name" required className="px-3 py-1.5 border rounded text-sm w-28" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">标识</label>
          <input name="slug" required className="px-3 py-1.5 border rounded text-sm w-28" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">描述</label>
          <input name="description" className="px-3 py-1.5 border rounded text-sm w-40" />
        </div>
        <button type="submit" disabled={loading} className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
          + 新增
        </button>
      </form>

      {/* 分类列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">名称</th>
              <th className="text-left px-4 py-3">标识</th>
              <th className="text-left px-4 py-3">描述</th>
              <th className="text-right px-4 py-3">商品数</th>
              <th className="text-right px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t border-gray-100">
                {editingId === cat.id ? (
                  <>
                    <td colSpan={5} className="px-4 py-3">
                      <form onSubmit={(e) => handleUpdate(e, cat.id)} className="flex gap-3 items-end">
                        <input name="name" defaultValue={cat.name} required className="px-3 py-1.5 border rounded text-sm w-28" />
                        <input name="slug" defaultValue={cat.slug} required className="px-3 py-1.5 border rounded text-sm w-28" />
                        <input name="description" defaultValue={cat.description || ""} className="px-3 py-1.5 border rounded text-sm w-40" />
                        <button type="submit" className="px-3 py-1.5 bg-green-600 text-white text-sm rounded">保存</button>
                        <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 border text-sm rounded">取消</button>
                      </form>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                    <td className="px-4 py-3 text-gray-500">{cat.description || "-"}</td>
                    <td className="px-4 py-3 text-right">{cat._count.products}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => setEditingId(cat.id)} className="text-blue-600 hover:underline text-sm">编辑</button>
                      <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-500 hover:underline text-sm">删除</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
