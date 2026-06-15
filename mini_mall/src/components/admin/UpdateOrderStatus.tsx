"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** 订单状态更新按钮 */
export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const statuses = [
    { value: "PENDING", label: "待支付" },
    { value: "PAID", label: "已支付" },
    { value: "SHIPPED", label: "已发货" },
    { value: "DELIVERED", label: "已送达" },
    { value: "CANCELLED", label: "已取消" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={updating}
      className="px-2 py-1 border rounded text-xs"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
