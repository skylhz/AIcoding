/** 订单状态中文映射 */
export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "待支付", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "已支付", color: "bg-green-100 text-green-700" },
  SHIPPED: { label: "已发货", color: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "已送达", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "已取消", color: "bg-gray-100 text-gray-500" },
};
