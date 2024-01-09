import express from "express";
import dotenv from "dotenv";
import passport from "../auth/passport";
import * as userModel from "../db/model/user";

dotenv.config();

const router = express.Router();

// Login
router.post("/", passport.authenticate("local"), function (req, res) {
  res.send("LOGIN");
});

router.get("/users/:id", async function (req, res) {
  await userModel.get();
});

router.get("/users", async function (req, res) {
  console.log(await userModel.getAll());
  return res.send(await userModel.getAll());
});

export default router;

// // Register
// router.post(apiRoot + "/auth", async function ({ body }, res) {
//   // Check if user exists
//   db.first("User", "username", body["username"]).then((u) => {
//     console.log(u);
//   });
// });
