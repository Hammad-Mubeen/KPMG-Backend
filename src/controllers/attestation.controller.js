const Response = require("../utils/response");
const AttestationService = require("../services/attestations.service");

module.exports = {
  addNewTextAttestation: function (req, res, next) {
    AttestationService.addNewTextAttestation(req.body,req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  addNewDocAttestation: function (req, res, next) {
    AttestationService.addNewDocAttestation(req.file,req.body,req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  search: function (req, res, next) {
    AttestationService.search(req.body,req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  myAttestations: function (req, res, next) {
    AttestationService.myAttestations(req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  allAttestations: function (req, res, next) {
    AttestationService.allAttestations(req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  },
  KPMGScan: function (req, res, next) {
    AttestationService.KPMGScan(req)
      .then((resp) => {
        return Response.Send.Raw(res, resp.code, resp.body);
      })
      .catch((err) => {
        next(err);
      });
  }
};
