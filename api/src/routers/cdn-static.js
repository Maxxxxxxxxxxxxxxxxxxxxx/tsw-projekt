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
    const userid = req.user;
    // @ts-ignore
    const filename = req.file.filename;

    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

    log.info(`Saved profile image for user ${req.user}`);
    log.debug(req.file);

    const newImagePath = `https://localhost:3000/images/${userid}/${filename}`;

    res.status(201).send(newImagePath);
  }
);

export default router;
