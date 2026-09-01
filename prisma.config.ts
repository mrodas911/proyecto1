import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

/**
 * Configuración de Prisma. Sustituye al bloque `prisma` de package.json,
 * obsoleto a partir de Prisma 7.
 *
 * Al existir este archivo, Prisma deja de cargar `.env` por su cuenta, así que
 * lo hacemos aquí con el cargador nativo de Node.
 */
const envFile = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
