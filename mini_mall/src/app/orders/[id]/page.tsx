import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { parseImages, formatPrice } from "@/lib/utils";

/** 订单详情页 */
export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const orderId = parseInt(id, 10);

  if (isNaN(orderId)) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { select: { slug: true, images: true } },
        },
      },
    },
  });

  if (!order || order.userId !== session.userId) notFound();

  const statusInfo = ORDER_STATUS_MAP[order.status] || {
    label: order.status,
    color: "bg-gray-100 text-gray-500",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
          <span
            className={`text-sm px-3 py-1 rounded-full font-medium ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* 收货信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">收货信息</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>收货地址：{order.address}</p>
            <p>联系电话：{order.phone}</p>
            {order.note && <p>备注：{order.note}</p>}
          </div>
        </div>

        {/* 商品列表 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">商品明细</h2>
          <div className="space-y-3">
            {order.items.map((item) => {
              const images: string[] = parseImages(item.product.images);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
                >
                  <Link href={`/products/${item.product.slug}`}>
                    <img
                      src={
                        images[0] ||
                        "https://placehold.co/60x60/e5e7eb/9ca3af?text=无"
                      }
                      alt={item.productName}
                      className="w-14 h-14 object-cover rounded bg-gray-100"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm text-gray-900 hover:text-blue-600 truncate block"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ¥{formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ¥{formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 订单信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">订单编号</span>
            <span className="text-gray-900">{order.id}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">下单时间</span>
            <span className="text-gray-900">
              {new Date(order.createdAt).toLocaleString("zh-CN")}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-4 pt-4 border-t">
            <span className="text-gray-900 font-medium">实付金额</span>
            <span className="text-xl font-bold text-red-600">
              ¥{formatPrice(order.total)}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/orders"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← 返回订单列表
          </Link>
        </div>
      </div>
    </main>
  );
}
