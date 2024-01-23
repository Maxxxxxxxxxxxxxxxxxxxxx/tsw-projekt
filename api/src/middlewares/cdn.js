import multer from "multer";
import path from "path";
import fs from "fs";
import log from "../log";

const staticFilesPath = path.join(__dirname, "../static");

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    const userDirPath = path.join(staticFilesPath, `/images/${req.user}`);

    if (!fs.existsSync(userDirPath)) {
      fs.mkdirSync(userDirPath);
      log.debug(`Created directory ${userDirPath}`);
    }

    next(null, path.join(userDirPath));
  },
  filename: (req, file, cb) => {
    // @ts-ignore
    cb(null, `${Date.now()}-${req.user}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });
