import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import UpdateOrderStatus from "@/components/admin/UpdateOrderStatus";

/** 订单管理页 */
export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">订单管理</h1>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">订单号</th>
              <th className="text-left px-4 py-3">用户</th>
              <th className="text-right px-4 py-3">金额</th>
              <th className="text-center px-4 py-3">状态</th>
              <th className="text-left px-4 py-3">时间</th>
              <th className="text-right px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusInfo = ORDER_STATUS_MAP[order.status] || { label: order.status, color: "bg-gray-100" };
              return (
                <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3">{order.user.name}<br /><span className="text-xs text-gray-400">{order.user.email}</span></td>
                  <td className="px-4 py-3 text-right font-medium">¥{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString("zh-CN")}</td>
                  <td className="px-4 py-3 text-right">
                    <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
