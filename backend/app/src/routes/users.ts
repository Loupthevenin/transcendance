import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { listUsers } from "../controllers/userController";

export default async function (
  app: FastifyInstance,
  opts: FastifyPluginOptions,
): Promise<void> {
  app.get("/", listUsers);
}
