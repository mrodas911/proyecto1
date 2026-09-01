import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["playwright-core", "@prisma/client", "bcryptjs"],
};

export default nextConfig;
