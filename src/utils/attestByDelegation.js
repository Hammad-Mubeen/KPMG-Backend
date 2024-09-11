require("dotenv").config();
const { EAS } = require("@ethereum-attestation-service/eas-sdk");
var { ethers }  = require("ethers");

const EASContractAddress = process.env.EAS_CONTRACT_ADDRESS; // Sepolia v0.26
const schemaUID = process.env.SCHEMA_UID;
const privateKey = process.env.PRIVATE_KEY;
const alchemyJSONRPC = process.env.ALCHEMY_JSON_RPC;

const attestByDelegation = async ( encodedData, signature, user) => {

    const senderProvider = new ethers.JsonRpcProvider(alchemyJSONRPC);
    const sender = new ethers.Wallet(privateKey, senderProvider);
    const eas = new EAS(EASContractAddress);
    eas.connect(sender);
    
    //attesting delegate attestation
    const transaction = await eas.attestByDelegation({
      schema: schemaUID,
      data: {
        recipient: user.walletAddress,
        expirationTime: BigInt(0),
        revocable: true,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: encodedData
      },
      signature: signature,
      attester: user.walletAddress,
      deadline: BigInt(0)
    });
    
    const newAttestationUID = await transaction.wait();
    console.log('New attestation UID:', newAttestationUID);
    console.log('Transaction receipt:', transaction.receipt);
    return newAttestationUID;
};
  
module.exports = attestByDelegation;
      