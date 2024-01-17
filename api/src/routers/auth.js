//@ts-nocheck

import express from "express";
import dotenv from "dotenv";
import passport from "../auth/passport";
import * as userModel from "../db/model/user";
import { checkAuthenticated } from "../middlewares/isAuth";

dotenv.config();

const router = express.Router();

// Login
router.post("/", passport.authenticate("local"), function (req, res) {
  res.status(200).send();
});

// Register new user
router.post("/", function (req, res) {
  req.res.status(200).send();
});

// Protected route
router.get("/protected", checkAuthenticated, (req, res) => {
  console.log("user:", req.user);
  res.json(req.user);
});

export default router;
