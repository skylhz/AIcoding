/** Server Action 错误类型，用于客户端区分处理 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

/**
 * 安全解析 JSON 字符串为字符串数组
 * 用于商品图片字段解析，防止损坏数据导致页面崩溃
 */
export function parseImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 计算购物车/订单总价（单位：分）
 * 传入 { price, quantity } 数组，返回总金额（分）
 */
export function calculateTotal(
  items: { price: number; quantity: number }[]
): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * 价格格式化：分 → 元（保留两位小数）
 */
export function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}
