//@ts-nocheck
import express from "express";
import * as userModel from "../db/model/user";
import {
  authorizeProfileMethod,
  checkAuthenticated,
} from "../middlewares/isAuth";
import log from "../log";

const router = express.Router();

router.get("/me", checkAuthenticated, async function (req, res) {
  const userData = await userModel.get(req.user);
  res.status(200).send(userData);
});

router.get("/all", checkAuthenticated, async function (req, res) {
  const userData = await userModel.getAll();
  res.status(200).send(userData);
});

router.get("/me/followed", checkAuthenticated, async function (req, res) {
  const userData = await userModel.getFollowed(req.user);
  res.status(200).send(userData);
});

router.get("/user/:id", async function (req, res) {
  const userId = req.params.id;

  try {
    const u = await userModel.get(userId);
    const d = u[0];

    const { passwordHash, ...userData } = d;

    return res.status(200).send(userData);
  } catch {
    return res.status(404).send();
  }
});

router.post("/follow/:id", checkAuthenticated, async function (req, res) {
  const userId = req.params.id;

  try {
    const r = await userModel.follow(req.user, userId);
    res.status(201).send();
  } catch {
    return res.status(500).send();
  }
});

router.delete("/follow/:id", checkAuthenticated, async function (req, res) {
  const userId = req.params.id;

  try {
    const r = await userModel.unfollow(req.user, userId);
    res.status(204).send();
  } catch {
    return res.status(500).send();
  }
});

router.put(
  "/profile/:id",
  checkAuthenticated,
  authorizeProfileMethod,
  async function (req, res) {
    const userId = req.params.id;

    const { bio, image } = req.body;

    try {
      if (bio) await userModel.updateBio(userId, bio);
      if (image) await userModel.updateImage(userId, image);

      const updatedUser = await userModel.get(userId);
      return res.status(201).send(updatedUser);
    } catch {
      return res.status(500).send();
    }
  }
);

export default router;
