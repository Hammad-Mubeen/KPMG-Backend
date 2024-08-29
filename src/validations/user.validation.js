const Joi = require("joi");
const { mintNFT } = require("../services/users.service");

module.exports = {
  onboarding: {
    body: Joi.object({
      token: Joi.string().required()
    }),
  }
};
