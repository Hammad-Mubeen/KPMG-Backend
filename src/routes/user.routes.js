const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate");

const userController = require("../controllers/user.controller");
const userValidation = require("../validations/user.validation");
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router

  .post("/onboarding", validate(userValidation.onboarding), userController.onboarding)
  .get("/", auth, userController.getUser)
  .post("/convertDocumentToPdf", [auth, multer.singleFile("file")], userController.convertDocumentToPdf)
  .post("/uploadDocToCreateHash", [auth, multer.singleFile("file")], userController.uploadDocToCreateHash)
  .post("/uploadTextToCreateHash", [auth, validate(userValidation.uploadTextToCreateHash)], userController.uploadTextToCreateHash);

module.exports = router;
