const express = require("express");
const router = express.Router({ caseSensitive: true });

const userRoutes = require("./user.routes");
const attestationRoutes = require("./attestation.routes");

router.use("/user", userRoutes);
router.use("/attestation", attestationRoutes);

module.exports = router;
