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
  .post("/convertDocxToPdf", [auth, multer.singleFile("file")], userController.convertDocxToPdf);

module.exports = router;
