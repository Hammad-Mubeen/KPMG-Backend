const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate");

const userController = require("../controllers/user.controller");
const userValidation = require("../validations/user.validation");
const auth = require("../middlewares/auth");

router

  .get("/getUserWhiteListStatus", auth, userController.getUserWhiteListStatus)
  .post("/onboarding", validate(userValidation.onboarding), userController.onboarding);

module.exports = router;
