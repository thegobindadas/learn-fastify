import fastifyPlugin from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";



export default fastifyPlugin(async function (fastify, opts) {

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET,
  });

  
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});