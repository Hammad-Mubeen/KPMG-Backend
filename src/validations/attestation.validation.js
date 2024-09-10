const Joi = require("joi");

module.exports = {
  addNewTextAttestation: {
    body: Joi.object({
      text: Joi.string().required(),
      encodedData: Joi.string().required(),
      signature: Joi.object().required()
    })
  },
  addNewDocAttestation: {
    body: Joi.object({
      documentType: Joi.string().required(),
      size: Joi.number().required(),
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
