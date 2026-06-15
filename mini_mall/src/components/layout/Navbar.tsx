import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

/**
 * 顶部导航栏
 * 显示网站标题、登录/注册或用户信息和退出按钮
 */
export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 左侧：Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Mini Mall
        </Link>

        {/* 右侧：用户信息 / 登录注册 */}
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.name}
                {user.role === "ADMIN" && (
                  <span className="ml-1 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                    管理员
                  </span>
                )}
              </span>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  后台管理
                </Link>
              )}
              <Link
                href="/orders"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                我的订单
              </Link>
              <Link
                href="/cart"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                购物车
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
