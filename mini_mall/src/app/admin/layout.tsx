import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/** 后台管理布局：左侧导航 + 右侧内容 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const navItems = [
    { href: "/admin", label: "仪表盘", icon: "📊" },
    { href: "/admin/products", label: "商品管理", icon: "📦" },
    { href: "/admin/categories", label: "分类管理", icon: "🏷️" },
    { href: "/admin/orders", label: "订单管理", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 relative">
        <div className="p-4 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold text-blue-600">
            Mini Mall
          </Link>
          <p className="text-xs text-gray-400 mt-1">后台管理</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-blue-600">
            ← 返回前台
          </Link>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
