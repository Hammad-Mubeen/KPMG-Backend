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
      "parent",
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
      "latestVersion",
      "referringAttestations",
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
