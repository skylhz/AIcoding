import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

/** 后台仪表盘 */
export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const stats = [
    { label: "商品总数", value: productCount, icon: "📦" },
    { label: "订单总数", value: orderCount, icon: "📋" },
    { label: "用户总数", value: userCount, icon: "👥" },
    { label: "总营收", value: `¥${formatPrice(revenue._sum.total || 0)}`, icon: "💰" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">仪表盘</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-lg shadow-sm p-5 flex items-center gap-4"
          >
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
