import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function runMigrations(options = {}) {
  const dbClient = await database.getNewClient();

  try {
    const result = await migrationRunner({
      dbClient,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      ...options,
    });

    return result;
  } finally {
    await dbClient.end();
  }
}

async function getHandler(request, response) {
  const pendingMigrations = await runMigrations({ dryRun: true });
  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await runMigrations({ dryRun: false });

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  return response.status(200).json(migratedMigrations);
}
