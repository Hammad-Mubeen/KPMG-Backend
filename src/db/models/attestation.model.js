const whitelist = require("../../utils/whitelist");

module.exports = {
  table: "attestations",
  whitelist: (data) =>
    whitelist(data, [
      "UID",
      "schema",
      "email",
      "creator",
      "recipient",
      "time",
      "expirationTime",
      "revocable",
      "refUID",
      "name",
      "description",
      "tags",
      "size",
      "attestationType",
      "type",
      "docHash",
      "document",
      "documentType",
      "version",
      "textHash",
      "text",
      "age",
      "verifyOnEAS",
      "dateCreated",
      "lastModified",
      //world id verification
      "merkleRoot",
      "nullifierHash",
      "proof",
      "verificationLevel"
    ]),
};
