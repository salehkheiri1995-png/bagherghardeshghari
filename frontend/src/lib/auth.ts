import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "❌ JWT_SECRET environment variable is not set. " +
      "Please add JWT_SECRET to your .env file with a minimum 32-character random string."
    );
  }
  if (secret.length < 32) {
    console.warn(
      "⚠️  WARNING: JWT_SECRET is less than 32 characters. " +
      "This is insecure. Please use a longer secret key."
    );
  }
  return new TextEncoder().encode(secret);
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ⚠️ This function is async and must be called with `await`.
// Callers who forget `await` will receive the Promise object instead of the token string.
export async function generateToken(payload: JwtPayload): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  // 1) Authorization: Bearer <token>
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  // 2) fallback: HttpOnly cookie "auth-token"
  try {
    const cookieStore = cookies();
    const cookieToken = cookieStore.get("auth-token")?.value;
    if (cookieToken) return cookieToken;
  } catch {
    // cookies() ممکنه خارج از request context بیاندازه، ignore میکنیم
  }
  return null;
}

export async function extractUserFromRequest(
  request: Request
): Promise<JwtPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
