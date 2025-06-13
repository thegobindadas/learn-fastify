import {
  createThumbnail,
  getThumbnails,
  getThumbnail,
  updateThumbnail,
  deleteThumbnail,
  deleteAllThumbnails
} from "../controllers/thumbnailController.js";



export default async function (fastify, opts) {

  fastify.register(async function (fastify) {

    fastify.addHook("preHandler", fastify.authenticate);


    fastify.post("/", createThumbnail);

    fastify.get("/", getThumbnails);

    fastify.get("/:id", getThumbnail);

    fastify.put("/:id", updateThumbnail);

    fastify.delete("/:id", deleteThumbnail);

    fastify.delete("/", deleteAllThumbnails);
    
  });
};