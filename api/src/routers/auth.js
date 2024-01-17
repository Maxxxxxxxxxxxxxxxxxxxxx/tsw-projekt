//@ts-nocheck

import express from "express";
import dotenv from "dotenv";
import passport from "../auth/passport";
import * as userModel from "../db/model/user";
import { checkAuthenticated } from "../middlewares/isAuth";

dotenv.config();

const router = express.Router();

// Login
router.put("/", passport.authenticate("local"), function (req, res) {
  res.status(200).send();
});

// Register new user
router.post("/", async function (req, res) {
  const { username, password } = req.body;
  const r = await userModel.save(username, password);

  if (!r) {
    res.status(409).json("User already exists!");
  } else {
    res.status(200);
  }
});

// Protected route
router.get("/protected", checkAuthenticated, (req, res) => {
  console.log("user:", req.user);
  res.json(req.user);
});

export default router;
