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
  getUser: function (req, res) {
    UserService.getUser(req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  updateUser: function (req, res, next) {
    UserService.updateUser(req.body, req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  convertDocumentToPdf: function (req, res, next) {
    UserService.convertDocumentToPdf(req.file, req)
      .then((resp) => {
        // Set the response headers and pipe the PDF stream
        res.setHeader('Content-Disposition', 'attachment; filename="converted.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        resp.pipe(res);
      })
      .catch((err) => {
        next(err);
      });
  },
  uploadDocToCreateHash: function (req, res, next) {
    UserService.uploadDocToCreateHash(req.file, req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  uploadTextToCreateHash: function (req, res, next) {
    UserService.uploadTextToCreateHash(req.body,req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  }
};
