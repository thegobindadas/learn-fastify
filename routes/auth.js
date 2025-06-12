import {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout
} from "../controllers/authController.js"



module.exports = async function (fastify, opts) {

  fastify.post("/register", register);

  fastify.post("/login", login);

  fastify.post("/forgot-password", forgotPassword);

  fastify.post("/reset-password/:token", resetPassword);
  
  fastify.post(
    "/logout",
    { preHandler: [fastify.authenticate] },
    logout
  );
};