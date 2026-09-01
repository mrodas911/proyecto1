import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getRules } from "@/lib/settings";
import { ToolsManager } from "@/components/admin/tools-manager";

export const metadata: Metadata = { title: "Herramientas" };
export const dynamic = "force-dynamic";

export default async function AdminToolsPage() {
  const [tools, rules] = await Promise.all([
    prisma.developmentTool.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: { _count: { select: { activities: true, planActivities: true } } },
    }),
    getRules(null),
  ]);

  return (
    <ToolsManager
      quotaCurrent={rules.toolsAllowedCurrentRole}
      quotaFuture={rules.toolsAllowedFutureRole}
      tools={tools.map((tool) => ({
        id: tool.id,
        name: tool.name,
        slug: tool.slug,
        description: tool.description,
        methodology: tool.methodology,
        icon: tool.icon,
        isCore: tool.isCore,
        developmentType: tool.developmentType,
        active: tool.active,
        order: tool.order,
        counts: tool._count,
      }))}
    />
  );
}
