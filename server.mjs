import path from "path";
import Fastify from "fastify";
import cors from "@fastify/cors"
import fastifySensible from "@fastify/sensible";
import fastifyEnv from "@fastify/env";
import mongoosePlugin from "./plugins/mongoose.mjs";



const fastify = Fastify({
  logger: true
})



fastify.register(cors)
fastify.register(fastifySensible)

fastify.register(fastifyEnv, {
    dotenv: true,
    schema: {
        type: "object",
        required: [ "PORT", "MONGODB_URI", "JWT_TOKEN" ],
        properties: {
            PORT: {
                type: "string",
                default: 3000
            },
            MONGODB_URI: {
                type: "string",
            },
            JWT_TOKEN: {
                type: "string",
            }
        }
    }
}).after((err) => {
    if (err) {
        console.error(`ENV load failed: ${err.message}`)
        process.exit(1)
    }
})

fastify.register(mongoosePlugin)



fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
    fastify.log.info("hello")
})

fastify.get('/test-db', function (request, reply) {
    try {
        const mongoose = fastify.mongoose
        const connectionState = mongoose.connection.readyState

         const statusMap = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };

        const status = statusMap[connectionState] || "unknown";

        reply.send({ database: status });

    } catch (error) {
        fastify.log.error(err);
        reply.status(500).send({ message: "Failed to connect to Database" });  
        process.exit(1);
    }
})




const start = async () => {
    try {
        await fastify.ready()
        await fastify.listen({ port: process.env.PORT })
        fastify.log.info(`server listening on - http://localhost:${process.env.PORT}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()