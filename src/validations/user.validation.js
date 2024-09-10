const Joi = require("joi");

module.exports = {
  onboarding: {
    body: Joi.object({
      token: Joi.string().required()
    })
  },
  updateUser: {
    body: Joi.object({
      firstName: Joi.string().min(3).max(255),
      lastName: Joi.string().min(3).max(255),
    })
  },
  uploadTextToCreateHash: {
    body: Joi.object({
      text: Joi.string().required()
    })
  }
};
