/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable("attestations", function (t) {
    t.string("UID", 200).primary().notNull();
    t.string("schema", 200).notNull();
    t.string("email", 200).notNull();
    t.string("creator", 200).notNull();
    t.string("recipient", 200).notNull();
    t.string("time", 200).notNull();
    t.string("expirationTime", 200).notNull();
    t.boolean("revocable").notNull();
    t.string("refUID", 200).notNull();
    t.string("name", 50).notNull();
    t.string("description").nullable();
    t.specificType('tags', 'text ARRAY');
    t.double("size").nullable();
    t.string("attestationType", 50).notNull();
    t.string("type", 50).notNull();
    t.string("docHash", 200).nullable();
    t.string("document", 200).nullable();
    t.string("documentType", 50).nullable;
    t.integer("version").nullable();
    t.string("textHash", 200).nullable();
    t.string("text").nullable();
    t.string("age").nullable();
    t.string("verifyOnEAS", 200).nullable();
    t.string("dateCreated").nullable();
    t.string("lastModified").nullable();
    t.string("merkle_root", 200).nullable();
    t.string("nullifier_hash", 200).nullable();
    t.string("proof", 200).nullable();
    t.string("verification_level").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("attestations");
};
