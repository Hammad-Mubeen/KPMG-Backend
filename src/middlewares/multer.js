const multer = require("multer");
const HTTP = require("../utils/httpCodes");
const Response = require("../utils/response");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|WEBP|webp|pdf|docx|doc)$/)) {
    throw {
      code: HTTP.BadRequest,
      error: "Image type is not valid.",
    };
  }
  cb(null, true);
};

module.exports = {
  singleFile: (name) => (req, res, next) => {
    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: "52428800" },
    }).single(name);

    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return {
            code: HTTP.BadRequest,
            error: Response.ErrorBody("Only 1 Image is Required.", {}),
          };
        }
      }
      if (err) {
        return {
          code: HTTP.ServerError,
          error: Response.ErrorBody("Something went wrong. Try again later.", err),
        };
      }
      next();
    });
  },
  anyFields: (files) => (req, res, next) => {
    const upload = multer({
      storage,
      limits: { fileSize: "52428800" },
    }).fields(files);
    upload(req, res, (err) => {
      if (err) {
        return {
          code: HTTP.ServerError,
          error: Response.ErrorBody("Something went wrong. Try again later.", err),
        };
      }
      next();
    });
  },
  multipleFiles: (files) => (req, res, next) => {
    const upload = multer({
      storage,
      limits: { fileSize: "52428800" },
    }).array(files);

    upload(req, res, (err) => {
      if (err) {
        return {
          code: HTTP.ServerError,
          error: Response.ErrorBody("Something went wrong. Try again later.", err),
        };
      }
      next();
    });
  },
};
