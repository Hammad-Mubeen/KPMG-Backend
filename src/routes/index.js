const express = require("express");
const router = express.Router({ caseSensitive: true });

const userRoutes = require("./user.routes");

router.use("/user", userRoutes);

module.exports = router;
