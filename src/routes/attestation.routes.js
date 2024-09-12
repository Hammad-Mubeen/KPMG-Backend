const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate");

const attestationController = require("../controllers/attestation.controller");
const attestationValidation = require("../validations/attestation.validation");
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router

  .post("/addNewAttestation", [auth, multer.singleFile("file"),validate(attestationValidation.addNewAttestation)], attestationController.addNewAttestation)
  .post("/compareDocument", [multer.singleFile("file"), validate(attestationValidation.compareDocument)], attestationController.compareDocument)
  .post("/inspect", [auth, validate(attestationValidation.inspect)], attestationController.inspect)
  .post("/search", [auth, validate(attestationValidation.search)], attestationController.search)
  .get("/myAttestations", auth, attestationController.myAttestations)
  .get("/allAttestations", auth, attestationController.allAttestations)
  .get("/KPMGScan", auth, attestationController.KPMGScan);

module.exports = router;
