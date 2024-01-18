import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, next) {
    next(null, path.join(__dirname, "../static/"));
  },
  filename: (req, file, cb) => {
    // cb(null, Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
