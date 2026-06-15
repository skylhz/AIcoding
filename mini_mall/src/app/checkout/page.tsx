import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { checkout } from "@/lib/cart-actions";
import { parseImages, calculateTotal, formatPrice } from "@/lib/utils";

/** 结算页面：确认收货信息 + 模拟支付 */
export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // 获取购物车商品
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.userId },
    include: {
      product: { select: { id: true, name: true, price: true, images: true } },
    },
  });

  if (cartItems.length === 0) {
    redirect("/cart");
  }

  const total = calculateTotal(
    cartItems.map((item) => ({
      price: item.product.price,
      quantity: item.quantity,
    }))
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">确认订单</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：收货信息表单 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                收货信息
              </h2>
              <form action={checkout} className="space-y-4">
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    收货地址
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    placeholder="请输入详细收货地址"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    联系电话
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="^1[3-9]\d{9}$"
                    placeholder="请输入11位手机号码"
                    title="请输入正确的手机号码"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="note"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    备注（选填）
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={2}
                    placeholder="如有特殊要求请备注"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  确认支付 ¥{formatPrice(total)}
                </button>
              </form>
            </div>
          </div>

          {/* 右侧：订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                订单摘要
              </h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <img
                      src={
                        parseImages(item.product.images)[0] ||
                        "https://placehold.co/40x40/e5e7eb/9ca3af?text=无"
                      }
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded bg-gray-100"
                    />
                    <span className="flex-1 truncate text-gray-600">
                      {item.product.name}
                    </span>
                    <span className="text-gray-400">×{item.quantity}</span>
                    <span className="text-gray-900 font-medium">
                      ¥{formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                <span className="text-gray-600">合计</span>
                <span className="text-lg font-bold text-red-600">
                  ¥{formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
