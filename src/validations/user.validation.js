const Joi = require("joi");
const { mintNFT } = require("../services/users.service");

module.exports = {
  onboarding: {
    body: Joi.object({
      walletAddress: Joi.string().required(),
      token: Joi.string().required()
    }),
  }
};
