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
    ? await postModel.citePost(userId, postContent, citationId)
    : await postModel.save(userId, postContent);

  res.status(201).json(createdPost);
});

// Reply to post endpoint
router.post("/reply", checkAuthenticated, async function (req, res) {
  const userId = req.user;
  const postContent = req.body.content;
  const opId = req.query["op"];

  log.debug(opId);

  const citationId = req.query["cite"];

  try {
    const result = citationId
      ? await postModel.saveReplyWithCitation(
          userId,
          postContent,
          opId,
          citationId
        )
      : await postModel.saveReply(userId, postContent, opId);
    res.status(201).json(result);
  } catch (e) {
    log.error(e);
    res.status(500).send();
  }
});

// Get thread view
router.get("/:id", async function (req, res) {
  const postid = req.params.id;
  const replies = await postModel.getReplies(postid);
  res.json(replies);
});

router.get("/all", async function (req, res) {
  const threads = await postModel.getThreads();
  res.json(threads);
});

router.get("/", checkAuthenticated, async function (req, res) {
  try {
    const threads = await postModel.getThreadsFollowed(
      req.user
      // 1704075043000, // req.body.start
      // 1706148643000  // req.body.end
    );
    res.status(200).send(threads);
  } catch {
    res.status(200).send([]);
  }
});

router.get("/single/:id", async function (req, res) {
  const postid = req.params.id;
  const thread = await postModel.get(postid);
  res.json(thread);
});

// Get user's threads
router.get("/user/:id", async function (req, res) {
  const userid = req.params.id;
  const replies = await postModel.getUserThreads(userid);
  res.status(200).send(replies);
});

// Get post's cited post
router.get("/cited/:id", async function (req, res) {
  const postid = req.params.id;
  const replies = await postModel.getCited(postid);

  // console.log(await postModel.getCited("55b7ac40-de22-4324-89f3-1b951f8bf772"));
  console.log(req.params.id);
  res.status(200).send(replies);
});

export default router;
