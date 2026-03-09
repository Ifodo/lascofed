import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const ADMIN_SESSION_COOKIE = "coop_admin_session";

export type AdminRole = "SUPER_ADMIN" | "EDITOR";

export type AdminSessionPayload = JWTPayload & {
  sub: string;
  email: string;
  role: AdminRole;
  fullName: string;
};

const encoder = new TextEncoder();

function getAuthSecret() {
  const secret = process.env.ADMIN_AUTH_SECRET;

  if (!secret) {
    throw new Error("ADMIN_AUTH_SECRET is required.");
  }

  return encoder.encode(secret);
}

export async function signAdminSession(payload: {
  sub: string;
  email: string;
  role: AdminRole;
  fullName: string;
}) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    fullName: payload.fullName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getAuthSecret());
}

export async function verifyAdminSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify<AdminSessionPayload>(token, getAuthSecret());

    if (!payload.sub || !payload.email || !payload.role || !payload.fullName) {
      return null;
    }

    if (payload.role !== "SUPER_ADMIN" && payload.role !== "EDITOR") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
