import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyPassword, setSession } from "@/lib/auth";

/**
 * POST /api/auth/login
 * 登录：验证邮箱和密码，写入 session
 * 安全措施：
 *   - 统一返回"邮箱或密码错误"，不区分用户不存在和密码错误
 *   - 用户不存在时也执行 bcrypt.compare（消除时间侧信道）
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "请输入邮箱和密码" },
        { status: 400 }
      );
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 无论用户是否存在都执行 bcrypt.compare，消除响应时间差异
    // 用户不存在时用固定假哈希比对（结果恒为 false）
    const isValid = user
      ? await verifyPassword(password, user.password)
      : await bcrypt.compare(
          password,
          "$2a$12$00000000000000000000000000000000000000000000000000000"
        );

    if (!user || !isValid) {
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    // 登录成功，写入 session
    await setSession(user.id, user.role);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("登录失败:", error);
    return NextResponse.json({ error: "登录失败，请稍后重试" }, { status: 500 });
  }
}
