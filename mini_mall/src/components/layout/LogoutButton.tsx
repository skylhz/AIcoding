"use client";

import { useRouter } from "next/navigation";

/**
 * 退出登录按钮
 * 调用 /api/auth/logout 清除 session 后刷新页面
 */
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-400 hover:text-red-500 transition-colors"
    >
      退出
    </button>
  );
}
