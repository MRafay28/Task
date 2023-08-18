import { Router } from "express";
const route = Router();
import { SignUp, login, sendImage } from "../controller/imageController.js";
// import { v4 as uuidv4 } from "uuid";
// import path from "path";

// import multer from "multer";
// import { fileURLToPath } from "url";
// // import { verification } from "../controllers/verification.js";
// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedFileTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
  
    if (allowedFileTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2147483648,
    },
  });
route.post(
  "/sendImage",
  upload.single("image"),
//   handleFileUploadError,
  sendImage
);

// route.post("/upload-images", upload.single("files"), uploadImages);

export default route;
