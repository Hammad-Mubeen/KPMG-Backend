require("dotenv").config();
const { EAS,SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk");
var { ethers }  = require("ethers");

const EASContractAddress = process.env.EAS_CONTRACT_ADDRESS; // Sepolia v0.26
const schemaUID = process.env.SCHEMA_UID;
const privateKey = process.env.PRIVATE_KEY;
const alchemyJSONRPC = process.env.ALCHEMY_JSON_RPC;


async function test()
{
    const senderProvider = new ethers.JsonRpcProvider(alchemyJSONRPC);
    const sender = new ethers.Wallet(privateKey, senderProvider);

    const eas = new EAS(EASContractAddress);

    eas.connect(sender);
    
    const delegated = await eas.getDelegated();
    
    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("string attestation_type,string title,string description,string[] tags,bytes32 document_hash,bytes32 text_hash,bytes merkle_root,bytes nullifier_hash,bytes proof,bytes verification_level");
    const encodedData = schemaEncoder.encodeData([
        { name: "attestation_type", value: "doc", type: "string" },
        { name: "title", value: "doc", type: "string" },
        { name: "description", value: "This is some doc", type: "string" },
        { name: "tags", value: ["doc"], type: "string[]" },
        { name: "document_hash", value: "0x367de7de38e82f15bc2730c876df5a515fd8b11f0816206453c6c897dde096a4", type: "bytes32" },
        { name: "text_hash", value: "0x0000000000000000000000000000000000000000000000000000000000000000", type: "bytes32" },
        { name: "merkle_root", value: "0x0000000000000000000000000000000000000000000000000000000000000000", type: "bytes" },
        { name: "nullifier_hash", value: "0x0000000000000000000000000000000000000000000000000000000000000000", type: "bytes" },
        { name: "proof", value: "0x0000000000000000000000000000000000000000000000000000000000000000", type: "bytes" },
        { name: "verification_level", value: "0x0000000000000000000000000000000000000000000000000000000000000000", type: "bytes" }
    ]);
    
    // Please note that if nonce isn't provided explicitly, we will try retrieving it onchain.
    const response = await delegated.signDelegatedAttestation(
      {
        schema: schemaUID,
        recipient: "0xE88Eab8A4Ca2c3A85b768a5186DD5fAD3BcD8C7C",
        expirationTime: BigInt(0), // Unix timestamp of when attestation expires (0 for no expiration)
        revocable: true,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: encodedData,
        deadline: BigInt(0), // Unix timestamp of when signature expires (0 for no expiration)
        value: BigInt(0)
      },
      sender
    );
    console.log('encoded Data: ',encodedData);
    console.log('signature:', response.signature);
}

test();