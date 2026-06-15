import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Session 有效期 7 天
const SESSION_DURATION = 7 * 24 * 60 * 60;

// 从环境变量获取密钥，编码为 Uint8Array 供 jose 使用
// 缺少密钥时抛出错误，不允许默认值（防止 JWT 伪造攻击）
function getSecret(): Uint8Array {
  if (!process.env.AUTH_SECRET) {
    throw new Error(
      "AUTH_SECRET 环境变量未设置。请在 .env 中配置 AUTH_SECRET=<随机字符串>"
    );
  }
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}

/**
 * 用 bcryptjs 哈希密码（salt 轮数 12）
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * 验证明文密码与哈希是否匹配
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * 把用户信息写入 httpOnly Cookie（JWT 签名防篡改）
 */
export async function setSession(
  userId: number,
  role: string
): Promise<void> {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

/** Session 载荷类型 */
interface SessionPayload {
  userId: number;
  role: string;
}

/**
 * 从 Cookie 读取并验证当前用户信息
 * 返回 null 表示未登录或 session 无效
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret());
    return { userId: payload.userId as number, role: payload.role as string };
  } catch {
    return null;
  }
}

/**
 * 获取当前登录用户的完整信息（不含密码字段）
 * 返回 null 表示未登录
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}

/**
 * 清除 Session Cookie（退出登录）
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}
