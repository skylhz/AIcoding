"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { calculateTotal, ActionError } from "@/lib/utils";

/**
 * 要求登录，否则重定向到登录页
 */
async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

/**
 * 加入购物车：已存在则增加数量，不存在则新建
 */
export async function addToCart(productId: number, quantity: number = 1) {
  const session = await requireUser();

  // 校验商品存在且库存充足
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true },
  });
  if (!product || product.stock < quantity) {
    throw new ActionError("商品库存不足");
  }

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: session.userId, productId } },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { userId: session.userId, productId, quantity },
    });
  }

  revalidatePath("/cart");
}

/**
 * 更新购物车商品数量
 */
export async function updateCartItem(cartItemId: number, quantity: number) {
  const session = await requireUser();

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: { id: cartItemId, userId: session.userId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId, userId: session.userId },
      data: { quantity },
    });
  }

  revalidatePath("/cart");
}

/**
 * 从购物车移除商品
 */
export async function removeCartItem(cartItemId: number) {
  const session = await requireUser();

  await prisma.cartItem.delete({
    where: { id: cartItemId, userId: session.userId },
  });

  revalidatePath("/cart");
}

/**
 * 结算下单：校验库存 → 扣减库存 → 创建订单 → 清空购物车
 * 全部在事务中完成，保证原子性
 */
export async function checkout(formData: FormData) {
  const session = await requireUser();

  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const note = formData.get("note") as string;

  if (!address || !phone) {
    throw new ActionError("请填写收货地址和联系电话");
  }

  // 获取购物车所有商品（含完整商品信息用于库存校验）
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new ActionError("购物车为空");
  }

  // 校验库存
  for (const item of cartItems) {
    if (item.product.stock < item.quantity) {
      throw new ActionError(`"${item.product.name}" 库存不足，当前库存 ${item.product.stock} 件`);
    }
  }

  const total = calculateTotal(
    cartItems.map((item) => ({
      price: item.product.price,
      quantity: item.quantity,
    }))
  );

  // 事务：扣减库存 + 创建订单 + 清空购物车
  const order = await prisma.$transaction(async (tx) => {
    // 扣减商品库存
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 创建订单
    const newOrder = await tx.order.create({
      data: {
        userId: session.userId,
        status: "PAID",
        total,
        address,
        phone,
        note: note || null,
      },
    });

    // 创建订单明细（快照商品名称和价格）
    await tx.orderItem.createMany({
      data: cartItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });

    // 清空购物车
    await tx.cartItem.deleteMany({
      where: { userId: session.userId },
    });

    return newOrder;
  });

  revalidatePath("/cart");
  revalidatePath("/orders");
  redirect(`/orders/${order.id}`);
}
