require("dotenv").config();
const { Magic } = require('@magic-sdk/admin');
const jwt = require("jsonwebtoken");
const DB = require("../db");

const UserModel = require("../db/models/user.model");

const HTTP = require("../utils/httpCodes");
const Logger = require("../utils/logger");

module.exports = {

  onboarding: async ({ token }) => {
    try {

      if(!token)
      {
          return {
            code: HTTP.NotFound,
            body: {
              message: "token have not been passed."
            }
          };
      }
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
  getUserWhiteListStatus: async ( {user} ) => {
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
      let whiteListedStatus = userData[0].is_white_listed;
      return {
        code: HTTP.Success,
        body: {whiteListedStatus},
      };
    } catch (err) {
      Logger.error("user.service -> getUserWhiteListStatus \n", err);
      throw err;
    }
  },
};
