//@ts-nocheck

import express from "express";
import dotenv from "dotenv";
import * as postModel from "../db/model/post";
import { checkAuthenticated } from "../middlewares/isAuth";

const router = express.Router();

// Protected route
router.get("/protected", checkAuthenticated, (req, res) => {
  res.json(req.user);
});

router.post("/", checkAuthenticated, async function (req, res) {
  const userId = req.user.userid;
  const postContent = req.body.content;

  const allPosts = await postModel.get();
  res.json(allPosts);
});

router.get("/", async function (req, res) {
  const allPosts = await postModel.get();
  res.json(allPosts);
});

export default router;
