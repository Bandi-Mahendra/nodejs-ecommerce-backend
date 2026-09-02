const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { AppError } = require("../utils/helpers");

const uploadDirectory = path.join(process.cwd(), "uploads", "products");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    cb(null, `${Date.now()}-${safeName || "product"}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new AppError("Only image files are allowed", 400), false);
  }

  return cb(null, true);
};

const uploadProductImages = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 5,
  },
}).array("images", 5);

module.exports = {
  uploadProductImages,
};
