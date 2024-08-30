require("dotenv").config();
const { Magic } = require('@magic-sdk/admin');
const jwt = require("jsonwebtoken");
const DB = require("../db");
const mammoth = require('mammoth');
const PDFDocument = require('pdfkit');
const { PassThrough } = require('stream');

const UserModel = require("../db/models/user.model");

const HTTP = require("../utils/httpCodes");
const Logger = require("../utils/logger");

module.exports = {

  onboarding: async ({ walletAddress, token }) => {
    try {

      if(!walletAddress)
      {
        return {
          code: HTTP.NotFound,
          body: {
            message: "walletAddress have not been passed."
          }
        };
      }
      if(!token)
      {
          return {
            code: HTTP.NotFound,
            body: {
              message: "token have not been passed."
            }
          };
      }
      console.log("walletAddress: ",walletAddress);
      console.log("token: ",token);
      
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
          walletAddress: walletAddress
        })
        .returning("*");
        console.log("newUser: ",newUser);
      }
      return {
        code: HTTP.Success,
        body: {
          message: "DID Token Verified.",
          access_token: jwt.sign({ email: user.email }, process.env.AUTH_SECRET, {
            expiresIn: "7d",
          }),
        },
      };
      
    } catch (err) {
      Logger.error("user.service -> onboarding \n", err);
      throw err;
    }
  },
  convertDocxToPdf: async (file) => {
    try {

      if (!file) {
        return {
          code: HTTP.BadRequest,
          body: {
            message: "No file uploaded."
          }
        };
      }
      // Convert DOCX to plain text using mammoth
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      console.log("DOCX to plain text: ",result);

      // Create a PDF document
      const pdfDoc = new PDFDocument();
      const pdfStream = new PassThrough();

      pdfDoc.pipe(pdfStream);
      pdfDoc.text(result.value);
      pdfDoc.end();

      return pdfStream;

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
};
