//@ts-nocheck
import express from "express";
import * as postModel from "../db/model/post";
import { checkAuthenticated } from "../middlewares/isAuth";
import log from "../log";

const router = express.Router();

// Create new post
router.post("/", checkAuthenticated, async function (req, res) {
  const userId = req.user;
  const postContent = req.body.content;

  const citationId = req.query["cite"];

  const createdPost = citationId
    ? await postModel.citePost(userId, content, citationId)
    : await postModel.save(userId, postContent);

  res.status(201).json(createdPost);
});

// Reply to post endpoint
router.post("/:id", checkAuthenticated, async function (req, res) {
  const userId = req.user;
  const postContent = req.body.content;
  const opId = req.params.id;

  const citationId = req.query["cite"];

  const result = citationId
    ? await postModel.saveReplyWithCitation(
        userId,
        postContent,
        opId,
        citationId
      )
    : await postModel.saveReply(userId, postContent, opId);

  res.status(201).json(result);
});

// Get thread view
router.get("/:id", async function (req, res) {
  const allPosts = await postModel.get();
  res.json(allPosts);
});

router.get("/", async function (req, res) {
  const threads = await postModel.getThreads();
  res.json(threads);
});

export default router;
