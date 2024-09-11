const Joi = require("joi");

module.exports = {
  addNewAttestation: {
    body: Joi.object({
      text: Joi.string(),
      documentType: Joi.string(),
      size: Joi.number(),
      encodedData: Joi.string().required(),
      signature: Joi.object().required()
    })
  },
  search: {
    body: Joi.object({
      attestation: Joi.string(),
      UID: Joi.string(),
      schema: Joi.string(),
      address: Joi.string(),
    })
  },
};
