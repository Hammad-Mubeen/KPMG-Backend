const Response = require("../utils/response");
const UserService = require("../services/users.service");

module.exports = {
  onboarding: function (req, res, next) {
    UserService.onboarding(req.body, req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  getUserWhiteListStatus: function (req, res) {
    UserService.getUserWhiteListStatus(req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
};
