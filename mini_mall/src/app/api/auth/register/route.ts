import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSession } from "@/lib/auth";

/**
 * POST /api/auth/register
 * 注册新用户：验证邮箱唯一性、密码长度，创建用户并写入 session
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    // 参数校验
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      );
    }

    // 用户名长度校验
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: "用户名长度需要在2-50个字符之间" },
        { status: 400 }
      );
    }

    // 邮箱格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "邮箱格式不正确" },
        { status: 400 }
      );
    }

    // 密码长度校验
    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码长度不能少于6位" },
        { status: 400 }
      );
    }

    // 邮箱唯一性检查
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 创建用户（密码哈希存储）
    const hashedPwd = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPwd,
        name,
        role: "USER",
      },
    });

    // 自动登录：写入 session
    await setSession(user.id, user.role);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
