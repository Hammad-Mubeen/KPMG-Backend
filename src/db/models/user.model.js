const whitelist = require("../../utils/whitelist");

module.exports = {
  table: "users",
  whitelist: (data) =>
    whitelist(data, [
      "email",
      "walletAddress",
      "firstName",
      "lastName"
    ]),
};
