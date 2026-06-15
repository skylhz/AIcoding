import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateTotal } from "@/lib/utils";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";

/** 购物车页面：需登录 */
export default async function CartPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  // 获取当前用户的购物车商品
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.userId },
    include: {
      product: {
        select: { id: true, name: true, slug: true, price: true, images: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 计算总价和总数
  const total = calculateTotal(
    cartItems.map((item) => ({
      price: item.product.price,
      quantity: item.quantity,
    }))
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">我的购物车</h1>

        {cartItems.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4">
              {cartItems.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
            <CartSummary total={total} itemCount={itemCount} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm text-center py-20">
            <p className="text-gray-400 text-lg mb-4">购物车是空的</p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              去逛逛
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
