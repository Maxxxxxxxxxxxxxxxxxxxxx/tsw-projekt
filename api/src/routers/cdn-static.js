import express from "express";
import multer from "multer";
import { checkAuthenticated } from "../middlewares/isAuth";
import { upload } from "../middlewares/cdn";
import path from "path";
import log from "../log";

const router = express.Router();

router.post(
  "/upload",
  // checkAuthenticated,
  upload.single("image"),
  async function (req, res) {
    log.debug(`Saved profile image for user ${req.user}`);
    log.debug(req.file);
    res.status(201).send();
  }
);

export default router;
