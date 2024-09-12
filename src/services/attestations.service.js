require("dotenv").config();
const DB = require("../db");
const { SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk");
const moment = require('moment');
const { v4: uuidv4 } = require("uuid");
const { createHash } = require("crypto");

const AttestationModel = require("../db/models/attestation.model");
const UserModel = require("../db/models/user.model");

const HTTP = require("../utils/httpCodes");
const Logger = require("../utils/logger");
const { fileUpload, getFile } = require("../utils/S3Config");
const attestByDelegation = require("../utils/attestByDelegation");

const schemaUID = process.env.SCHEMA_UID;
const easAttestationURL = process.env.EAS_ATTESTATION_URL;

module.exports = {

  addNewAttestation: async ( file, { documentType, size, text, encodedData, signature}, { user } ) => {
    try { 

      //decoding data from encoded Data
      const schemaEncoder = new SchemaEncoder("string attestation_type,string title,string description,string[] tags,bytes32 document_hash,bytes32 text_hash,bytes merkle_root,bytes nullifier_hash,bytes proof,bytes verification_level");
      const decodedData = schemaEncoder.decodeData(encodedData);

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

      if(attestation_type != "text" && attestation_type != "doc")
      {
        return {
          code: HTTP.BadRequest,
          body: {
            message: "Attestation type not supported."
          }
        };
      }

      if(attestation_type == "text")
      {
        if(!text)
        {
          return {
            code: HTTP.NotFound,
            body: {
              message: "text have not been passed."
            }
          };
        }
      }

      if(attestation_type == "doc")
      {
        if(!file)
        {
          return {
            code: HTTP.NotFound,
            body: {
              message: "file have not been passed."
            }
          };
        }
        if(!size)
        {
          return {
            code: HTTP.NotFound,
            body: {
              message: "size have not been passed."
            }
          };
        }
        if(!documentType)
        {
          return {
            code: HTTP.NotFound,
            body: {
              message: "documentType have not been passed."
            }
          };
        }  
      }

      // creating a attestation
      const newAttestationUID = await attestByDelegation(encodedData, signature, user);
      let timestamp = Math.floor(Date.now() / 1000);

      // creating record of the attestation
      let newAttestation = await DB(AttestationModel.table)
      .insert({
        type: "On Chain",
        attestationType: attestation_type,
        schema: schemaUID,
        UID: newAttestationUID,
        verifyOnEAS: easAttestationURL  + newAttestationUID,
        email: user.email,
        creator: user.walletAddress,
        recipient: user.walletAddress,
        name: title,
        description: description,
        tags: tags,
        revocable: true,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        time: JSON.stringify(timestamp),
        expirationTime: JSON.stringify(0),
        age: moment.unix(timestamp).format("YYYY-MM-DDTHH:mm:ss"),
        dateCreated: moment.unix(timestamp).format('MMM D, YYYY'),
        lastModified: moment.unix(timestamp).format('MMM D, YYYY'),
        //world id verification
        merkleRoot: merkle_root,
        nullifierHash: nullifier_hash,
        proof: proof,
        verificationLevel: verification_level
      })
      .returning("*");

      if(attestation_type === "text")
      {
        newAttestation = await DB(AttestationModel.table)
        .where({ UID: newAttestationUID })
        .update({
          textHash: text_hash,
          text: text,
          docHash: document_hash,
          document: null,
          documentType: null,
          size: 0,
          version: 0,
        })
        .returning("*");
      }
      else if(attestation_type === "doc")
      {
        const url = `${uuidv4()}${moment().format("YYYY-MM-DDTHH:mm:ss")}`;

        await fileUpload(url, file.buffer, file.mimetype);

        newAttestation = await DB(AttestationModel.table)
        .where({ UID: newAttestationUID })
        .update({
          textHash: text_hash,
          text: null,
          docHash: document_hash,
          document: `${url}`,
          documentType: documentType,
          size: size,
          version: 1,
        })
        .returning("*");
      }

      console.log("New Attestation Recorded in DB: ",newAttestation);

      return {
        code: HTTP.Success,
        body: {
          message: "Attestation Successfully attested.",
          UID: newAttestationUID
        }
      };

    } catch (err) {
      Logger.error("attestation.service ->  addNewAttestation \n", err);
      throw err;
    }
  },
  compareDocument: async ( file, { UID },{ user } ) => {
    try {
      
      if (!file) {
        return {
          code: HTTP.BadRequest,
          body: {
            message: "No file uploaded."
          }
        };
      }

      let attestationData = await DB(AttestationModel.table).where({ UID: UID });
      
      if(attestationData.length == 0)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "Attestation don't exist against this UID."
          }
        };
      }

      var hash = createHash('sha256').update(file.buffer).digest('hex');

      let result = false;
      if(("0x" + hash) === attestationData[0].docHash)
      {
        result = true;
      }
      return {
        code: HTTP.Success,
        body: {
          message: "Document comparison Result!",
          hash: hash,
          documentComparisonResult: result
        }
      };


    } catch (err) {
      Logger.error("attestation.service ->  compareDocument\n", err);
      throw err;
    }
  },
  inspect: async ( { UID },{ user } ) => {
    try {
      let attestationData = await DB(AttestationModel.table).where({ UID: UID });
      
      if(attestationData.length == 0)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "Attestation don't exist against this UID."
          }
        };
      }

      let isUserAttestation= false;
      if(attestationData[0].email == user.email)
      {
        console.log("This is user own attestation");
        isUserAttestation = true;
      }
      else{
        console.log("This is other user attestation");
      }

      return {
        code: HTTP.Success,
        body: {
          message: "Attestation data found successfully.",
          attestationData: attestationData[0],
          isUserAttestation : isUserAttestation
        }
      };

    } catch (err) {
      Logger.error("attestation.service ->  inspect \n", err);
      throw err;
    }
  },
  myAttestations: async ( { user } ) => {
    try {
      let attestationData = await DB(AttestationModel.table).where({ email: user.email });
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
      Logger.error("attestation.service ->  myAttestations \n", err);
      throw err;
    }
  },
  allAttestations: async ( { user } ) => {
    try {
      let attestationData = await DB(AttestationModel.table);
      attestationData = attestationData.reverse();
      console.log("attestationData: ",attestationData);

      return {
        code: HTTP.Success,
        body: {
          message: "All Attestations data found successfully.",
          attestationData: attestationData
        }
      };

    } catch (err) {
      Logger.error("attestation.service ->  allAttestations \n", err);
      throw err;
    }
  },
  KPMGScan: async ( { user } ) => {
    try {
      let attestationData = await DB(AttestationModel.table).where({ schema: schemaUID });
      attestationData = attestationData.reverse();
      console.log("attestationData: ",attestationData);
      
      if(attestationData.length != 0)
      {
        for (i = 0; i < attestationData.length; i++)
        {
          let transactionTime = moment(attestationData[i].age);
          attestationData[i].age = transactionTime.fromNow();  
        }
      }

      return {
        code: HTTP.Success,
        body: {
          message: "All EAS registered schema attestations data found successfully.",
          attestationData: attestationData
        }
      };

    } catch (err) {
      Logger.error("attestation.service ->  KPMGScan \n", err);
      throw err;
    }
  },
  search: async ( { attestation, UID, schema, address },{ user } ) => {
    try {
      
      let attestationData = [];
      if(attestation != null)
      {
        attestationData = await DB(AttestationModel.table).where({ verifyOnEAS: attestation });
      }
      else if(UID != null){
        attestationData = await DB(AttestationModel.table).where({ UID: UID });
      }
      else if(schema != null){
        attestationData = await DB(AttestationModel.table).where({ schema: schema });
      }
      else if(address != null){
        attestationData = await DB(AttestationModel.table).where({ creator: address });
      }
     
      attestationData = attestationData.reverse();
      console.log("attestationData: ",attestationData);
      
      if(attestationData.length != 0)
      {
        for (i = 0; i < attestationData.length; i++)
        {
          let transactionTime = moment(attestationData[i].age);
          attestationData[i].age = transactionTime.fromNow();  
        }
      }

      return {
        code: HTTP.Success,
        body: {
          message: "Attestations data searched successfully.",
          attestationData: attestationData
        }
      };


    } catch (err) {
      Logger.error("attestation.service ->  search \n", err);
      throw err;
    }
  },
};
