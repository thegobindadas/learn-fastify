import { Thumbnail } from "../models/thumbnail.js";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import util from "util";


const pipelineAsync = util.promisify(pipeline);



export const createThumbnail = async (request, reply) => {
  try {
    const parts = request.part();
    let fields = {};
    let filename;

    for await (const part of parts) {
      if (part.file) {
        filename = `${Date.now()}-${part.filename}`;
        const saveTo = path.join(
          __dirname,
          "..",
          "uploads",
          "thumbnails",
          filename
        );
        await pipelineAsync(part.file, fs.createWriteStream(saveTo));
      } else {
        fields[part.filename] = part.value;
      }
    }

    const thumbnail = new Thumbnail({
      user: request.user.id,
      videoName: fields.videoName,
      version: fields.version,
      image: `/uploads/thumbnails/${filename}`,
      paid: fields.paid === "true",
    });

    await thumbnail.save();
    reply.code(201).send(thumbnail);
  } catch (err) {
    reply.send(err);
  }
};


export const getThumbnails = async (request, reply) => {
  try {
    const thumbnails = await Thumbnail.find({ user: request.user.id });
    reply.send(thumbnails);
  } catch (err) {
    reply.send(err);
  }
};


export const getThumbnail = async (request, reply) => {
  try {
    //validate it first
    const thumbnail = await Thumbnail.findOne({
      _id: request.params.id,
      user: request.user.id,
    });
    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }
    reply.send(thumbnail);
  } catch (err) {
    reply.send(err);
  }
};


export const updateThumbnail = async (request, reply) => {
  try {
    const updatedData = request.body;
    const thumbnail = await Thumbnail.findByIdAndUpdate(
      { _id: request.params.id, user: request.user.id },
      updatedData,
      { new: true }
    );
    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }
    reply.send(thumbnail);
  } catch (err) {
    reply.send(err);
  }
};


export const deleteThumbnail = async (request, reply) => {
  try {
    const thumbnail = await Thumbnail.findByIdAndDelete({
      _id: request.params.id,
      user: request.user.id,
    });
    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }

    const filepath = path.join(
      __dirname,
      "..",
      "uploads",
      "thumbnails",
      path.basename(thumbnail.image)
    );
    fs.unlink(filepath, (err) => {
      if (err) fastify.log.error(err);
    });

    reply.send({ message: "Thumbnail deleted" });
  } catch (err) {
    reply.send(err);
  }
};


export const deleteAllThumbnails = async (request, reply) => {
  try {
    const thumbnails = await Thumbnail.find({ user: request.user.id });

    await Thumbnail.deleteMany({ user: request.user.id });

    for (const thumbnail of thumbnails) {
      const filepath = path.join(
        __dirname,
        "..",
        "uploads",
        "thumbnails",
        path.basename(thumbnail.image)
      );
      fs.unlink(filepath, (err) => {
        if (err) fastify.log.error(err);
      });
    }
    reply.send({ message: "All thumbnails deleted" });
  } catch (err) {
    reply.send(err);
  }
};