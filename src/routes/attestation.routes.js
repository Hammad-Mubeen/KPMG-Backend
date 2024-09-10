const express = require("express");
const router = express.Router();

const validate = require("../middlewares/validate");

const attestationController = require("../controllers/attestation.controller");
const attestationValidation = require("../validations/attestation.validation");
const multer = require("../middlewares/multer");
const auth = require("../middlewares/auth");

router

  .post("/addNewTextAttestation", [auth, validate(attestationValidation.addNewTextAttestation)], attestationController.addNewTextAttestation)
  .post("/addNewDocAttestation", [auth, multer.singleFile("file"),validate(attestationValidation.addNewDocAttestation)], attestationController.addNewDocAttestation)
  .post("/search", [auth, validate(attestationValidation.search)], attestationController.search)
  .get("/myAttestations", auth, attestationController.myAttestations)
  .get("/allAttestations", auth, attestationController.allAttestations)
  .get("/KPMGScan", auth, attestationController.KPMGScan);

module.exports = router;
