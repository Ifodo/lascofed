import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken, type AdminRole } from "./admin-session";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyAdminSessionToken(token);
}

export async function requireAdminSession(allowedRoles?: AdminRole[]) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    redirect("/admin/login");
  }

  return session;
}
