import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { parseImages, formatPrice } from "@/lib/utils";

/** 我的订单列表页 */
export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: { select: { images: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">我的订单</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    订单号：{order.id}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      ORDER_STATUS_MAP[order.status]?.color || "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ORDER_STATUS_MAP[order.status]?.label || order.status}
                  </span>
                </div>

                {/* 订单商品预览 */}
                <div className="flex gap-2 mb-3">
                  {order.items.slice(0, 4).map((item) => (
                    <img
                      key={item.id}
                      src={
                        parseImages(item.product.images)[0] ||
                        "https://placehold.co/60x60/e5e7eb/9ca3af?text=无"
                      }
                      alt={item.productName}
                      className="w-14 h-14 object-cover rounded bg-gray-100"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    共 {order.items.length} 件商品
                  </span>
                  <span className="font-bold text-red-600">
                    ¥{formatPrice(order.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm text-center py-20">
            <p className="text-gray-400 text-lg mb-4">暂无订单</p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              去购物
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
