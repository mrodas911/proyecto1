import { destroySessionCookie, getSession } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { handler, ok } from "@/lib/http";

export const POST = handler(async () => {
  const session = await getSession();
  if (session) {
    await audit({
      companyId: session.companyId, userId: session.sub,
      action: "logout", entity: "User", entityId: session.sub,
    });
  }
  await destroySessionCookie();
  return ok({ ok: true });
});
