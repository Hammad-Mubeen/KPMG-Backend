require("dotenv").config();
const DB = require("../db");
const { EAS,SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk");
var { ethers }  = require("ethers");
const moment = require('moment');

const AttestationModel = require("../db/models/attestation.model");

const HTTP = require("../utils/httpCodes");
const Logger = require("../utils/logger");

const EASContractAddress = process.env.EASContractAddress; // Sepolia v0.26
const schemaUID = process.env.schemaUID;
const privateKey = process.env.privateKey;
const easAttestationURL = process.env.EASAttestationURL;

module.exports = {

  addNewTextAttestation: async ( { text, encodedData, signature }, { user } ) => {
    try {
      
      const senderProvider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/h9RWCx3Aq_mCeuDth1kGZB3MJixkoQhC");
      const sender = new ethers.Wallet(privateKey, senderProvider);

      const eas = new EAS(EASContractAddress);

      eas.connect(sender);

      //decoding data from encoded Data
      const schemaEncoder = new SchemaEncoder("string attestation_type,string title,string description,string[] tags,bytes32 document_hash,bytes32 text_hash,bytes merkle_root,bytes nullifier_hash,bytes proof,bytes verification_level");
      
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

      const decodedData = schemaEncoder.decodeData(encodedData);
      console.log("decoded Data: ",decodedData);

      const attestation_type = decodedData[0].value.value,
      title = decodedData[1].value.value,
      description = decodedData[2].value.value,
      tags = decodedData[3].value.value,
      document_hash= decodedData[4].value.value,
      text_hash = decodedData[5].value.value,
      merkle_root = decodedData[6].value.value,
      nullifier_hash = decodedData[7].value.value,
      proof = decodedData[8].value.value,
      verification_level = decodedData[9].value.value;

      let timestamp = Math.floor(Date.now() / 1000);

      // creating record of the text attestation
      const newAttestation = await DB(AttestationModel.table)
      .insert({
        UID: newAttestationUID,
        schema: schemaUID,
        email: user.email,
        creator: user.walletAddress,
        recipient: user.walletAddress,
        time: JSON.stringify(timestamp),
        expirationTime: JSON.stringify(0),
        revocable: true,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        name: title,
        description: description,
        tags: tags,
        size: 0,
        attestationType: attestation_type,
        type: "OnChain",
        docHash: document_hash,
        document: null,
        documentType: null,
        version: 0,
        textHash: text_hash,
        text: text,
        age: JSON.stringify(timestamp),
        verifyOnEAS: easAttestationURL  + newAttestationUID,
        dateCreated: moment.unix(timestamp).format('MMM D, YYYY'),
        lastModified: moment.unix(timestamp).format('MMM D, YYYY'),
        //world id verification
        merkleRoot: merkle_root,
        nullifierHash: nullifier_hash,
        proof: proof,
        verificationLevel: verification_level
      })
      .returning("*");

      console.log("New text Attestation Recorded in DB: ",newAttestation);
      return {
        code: HTTP.Success,
        body: {
          message: "Text Attestation Successfully attested.",
          UID: newAttestationUID
        }
      };

    } catch (err) {
      Logger.error("user.service ->  addNewTextAttestation \n", err);
      throw err;
    }
  },
  addNewDocAttestation: async ( file, { documentType, size, encodedData, signature }, { user } ) => {
    try {
 
      const senderProvider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/h9RWCx3Aq_mCeuDth1kGZB3MJixkoQhC");
      const sender = new ethers.Wallet(privateKey, senderProvider);

      const eas = new EAS(EASContractAddress);

      eas.connect(sender);

      //decoding data from encoded Data
      const schemaEncoder = new SchemaEncoder("string attestation_type,string title,string description,string[] tags,bytes32 document_hash,bytes32 text_hash,bytes merkle_root,bytes nullifier_hash,bytes proof,bytes verification_level");
      
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

      const decodedData = schemaEncoder.decodeData(encodedData);
      console.log("decoded Data: ",decodedData);

      const attestation_type = decodedData[0].value.value,
      title = decodedData[1].value.value,
      description = decodedData[2].value.value,
      tags = decodedData[3].value.value,
      document_hash= decodedData[4].value.value,
      text_hash = decodedData[5].value.value,
      merkle_root = decodedData[6].value.value,
      nullifier_hash = decodedData[7].value.value,
      proof = decodedData[8].value.value,
      verification_level = decodedData[9].value.value;

      let timestamp = Math.floor(Date.now() / 1000);

      // creating record of the text attestation
      const newAttestation = await DB(AttestationModel.table)
      .insert({
        UID: newAttestationUID,
        schema: schemaUID,
        email: user.email,
        creator: user.walletAddress,
        recipient: user.walletAddress,
        time: JSON.stringify(timestamp),
        expirationTime: JSON.stringify(0),
        revocable: true,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        name: title,
        description: description,
        tags: tags,
        size: size,
        attestationType: attestation_type,
        type: "OnChain",
        docHash: document_hash,
        document: null,
        documentType: documentType,
        version: 1,
        textHash: text_hash,
        text: null,
        age: JSON.stringify(timestamp),
        verifyOnEAS: easAttestationURL  + newAttestationUID,
        dateCreated: moment.unix(timestamp).format('MMM D, YYYY'),
        lastModified: moment.unix(timestamp).format('MMM D, YYYY'),
        //world id verification
        merkleRoot: merkle_root,
        nullifierHash: nullifier_hash,
        proof: proof,
        verificationLevel: verification_level
      })
      .returning("*");

      console.log("New Doc Attestation Recorded in DB: ",newAttestation);
      return {
        code: HTTP.Success,
        body: {
          message: "Doc Attestation Successfully attested.",
          UID: newAttestationUID
        }
      };

    } catch (err) {
      Logger.error("user.service ->  addNewDocAttestation \n", err);
      throw err;
    }
  },
  myAttestations: async ( { user } ) => {
    try {
      let attestationData = await DB(AttestationModel.table).where({ email: user.email });
      
      if(attestationData.length == 0)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "User don't have any attesttions."
          }
        };
      }
      attestationData = attestationData.reverse();
      console.log("attestationData: ",attestationData);

      return {
        code: HTTP.Success,
        body: {
          message: "User attestations data found successfully.",
          attestationData: attestationData
        }
      };

    } catch (err) {
      Logger.error("user.service ->  myAttestations \n", err);
      throw err;
    }
  },
  allAttestations: async ( { user } ) => {
    try {
      let attestationData = await DB(AttestationModel.table);

      if(attestationData.length == 0)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "There are no attesttions found in the db."
          }
        };
      }
      attestationData = attestationData.reverse();
      console.log("attestationData: ",attestationData);

      return {
        code: HTTP.Success,
        body: {
          message: "Attestations data found successfully.",
          attestationData: attestationData
        }
      };

    } catch (err) {
      Logger.error("user.service ->  allAttestations \n", err);
      throw err;
    }
  },
  KPMGScan: async ( { user } ) => {
    try {
      let attestationData = await DB(AttestationModel.table).where({ schema: schemaUID });

      if(attestationData.length == 0)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "Schema don't have any attesttions."
          }
        };
      }
      attestationData = attestationData.reverse();
      console.log("attestationData: ",attestationData);
      
      return {
        code: HTTP.Success,
        body: {
          message: "Schema attestations data found successfully.",
          attestationData: attestationData
        }
      };

    } catch (err) {
      Logger.error("user.service ->  KPMGScan \n", err);
      throw err;
    }
  },
  search: async ( { attestations, UID, schema, address },{ user } ) => {
    try {
      
      return {
        code: HTTP.Success,
        body: {
          message: "searching..."
        }
      };

    } catch (err) {
      Logger.error("user.service ->  search \n", err);
      throw err;
    }
  },
};
