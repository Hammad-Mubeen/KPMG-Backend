require("dotenv").config();
const { Magic } = require('@magic-sdk/admin');
const jwt = require("jsonwebtoken");
const DB = require("../db");
const { load } = require('@pspdfkit/nodejs');
const { Readable } = require("stream");
const { createHash } = require("crypto");

const UserModel = require("../db/models/user.model");

const HTTP = require("../utils/httpCodes");
const Logger = require("../utils/logger");

module.exports = {

  onboarding: async ({ token }) => {
    try {
      
      const magic = await Magic.init(process.env.MAGIC_SECRET_KEY);
      magic.token.validate(token);
      
      console.log("DID Token verified successfully with magic admin sdk.");
      let user = await magic.users.getMetadataByToken(token);
      console.log("user: ",user);

      let userData = await DB(UserModel.table).where({email: user.email});
      console.log("userData: ",userData);

      if(userData.length == 0)
      {
        console.log("User don't exist against this email, creating new user.");
        const newUser = await DB(UserModel.table)
        .insert({
          email: user.email,
          walletAddress: user.publicAddress
        })
        .returning("*");
        console.log("newUser: ",newUser);
      }
      return {
        code: HTTP.Success,
        body: {
          message: "DID Token Verified.",
          access_token: jwt.sign({ 
            email: user.email,
            issuer :user.issuer,
            publicAddress :user.publicAddress
          }, process.env.AUTH_SECRET, {
            expiresIn: "7d",
          }),
        },
      };
      
    } catch (err) {
      Logger.error("user.service -> onboarding \n", err);
      throw err;
    }
  },
  convertDocumentToPdf: async (file) => {
    try {
      
      if (!file) {
        return {
          code: HTTP.BadRequest,
          body: {
            message: "No file uploaded."
          }
        };
      }
      
      console.log("file biffer: ",file.buffer);

      const instance = await load({
        document: file.buffer,
      });
      const pdfBuffer = await instance.exportPDF();
 
      const stream = Readable.from(pdfBuffer);
      return stream;

    } catch (err) {
      Logger.error("users.service -> convertDocxToPdf \n", err);
      throw err;
    }
  },
  getUser: async ( {user} ) => {
    try {

      let userData = await DB(UserModel.table).where({ email: user.email });
      console.log("userData: ",userData);

      if(userData.length == 0)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "User don't exist against this email."
          }
        };
      }

      return {
        code: HTTP.Success,
        body: {
          user:userData[0]
        }
      };
    } catch (err) {
      Logger.error("user.service -> getUser \n", err);
      throw err;
    }
  },
  updateUser: async ( {firstName, lastName},{user} ) => {
    try {

      let userData = await DB(UserModel.table).where({ email: user.email });
      console.log("userData: ",userData);

      if(userData.length == 0)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "User don't exist against this email."
          }
        };
      }

      if( firstName != null && lastName != null)
      {
        userData = await DB(UserModel.table)
        .where({ email: user.email })
        .update({
          firstName: firstName,
          lastName: lastName
        });
      }
      if(firstName != null)
      {
        userData = await DB(UserModel.table)
        .where({ email: user.email })
        .update({
          firstName: firstName
        });
      }
      if(lastName != null)
      {
        userData = await DB(UserModel.table)
        .where({ email: user.email })
        .update({
          lastName: lastName
        });
      }

      return {
        code: HTTP.Success,
        body: {
          message: "User data has been updated successfully.",
          user: userData[0]
        }
      };
    } catch (err) {
      Logger.error("user.service -> updateUser \n", err);
      throw err;
    }
  },
  uploadDocToCreateHash: async ( file ) => {
    try {
      if (!file) {
        return {
          code: HTTP.BadRequest,
          body: {
            message: "No file uploaded."
          }
        };
      }
      var hash = createHash('sha256').update(file.buffer).digest('hex');
      return {
        code: HTTP.Success,
        body: {
          hash:hash
        }
      };

    } catch (err) {
      Logger.error("user.service -> uploadDocToCreateHash \n", err);
      throw err;
    }
  },
  uploadTextToCreateHash: async ( {text} ) => {
    try {
      var hash = createHash('sha256').update(text).digest('hex');
      return {
        code: HTTP.Success,
        body: {
          hash: hash
        }
      };

    } catch (err) {
      Logger.error("user.service -> uploadTextToCreateHash \n", err);
      throw err;
    }
  }
};
