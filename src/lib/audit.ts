import "server-only";
import { prisma } from "./prisma";

export async function audit(input: {
  companyId?: string | null;
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        companyId: input.companyId ?? null,
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        metadata: (input.metadata ?? undefined) as never,
        ip: input.ip ?? null,
      },
    });
  } catch {
    // La auditoría nunca debe romper la operación del usuario.
  }
}
