//@ts-nocheck

import express from "express";
import dotenv from "dotenv";
import passport from "../auth/passport";
import * as userModel from "../db/model/user";
import { checkAuthenticated } from "../middlewares/isAuth";
import log from "../log";

dotenv.config();

const router = express.Router();

// Login
router.put("/", passport.authenticate("local"), function (req, res) {
  log.debug(`Log in: ${req.user}`);
  if (!req.user) res.status(403).send();
  else res.status(200).send();
});

// Register new user
router.post("/", async function (req, res) {
  const { username, password } = req.body;
  const r = await userModel.save(username, password);

  if (!r) {
    res.status(409).json("User already exists!");
  } else {
    res.status(201).send();
  }
});

// Check auth
router.get("/", async function (req, res) {
  if (req.user) {
    log.debug(`User ${req.user} passed auth check`);
    const u = await userModel.get(req.user);
    const d = u[0];
    const { passwordHash, ...userData } = d;

    res.status(200).send(userData);
  } else {
    log.debug("Failed user auth check");
    res.status(403).send();
  }
});

// Protected route
router.get("/protected", checkAuthenticated, (req, res) => {
  console.log("user:", req.user);
  res.json(req.user);
});

export default router;
