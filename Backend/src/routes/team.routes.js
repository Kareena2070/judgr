const express = require("express");

const validate = require("../middlewares/validate.js");
const { createTeamSchema, inviteMemberSchema} = require("../validators/team.validator.js");

const teamController = require("../controllers/team.controller.js");
const authenticate = require("../middlewares/authenticate.js");
const requireRole = require("../middlewares/authorize.js");


const router = express.Router();

router.post(
  "/hackathons/:hackathonId/teams",

  authenticate,

  requireRole("student"),

  validate(createTeamSchema),

  teamController.createTeam
);

router.post(
  "/teams/:teamId/join",
  authenticate,
  requireRole("student"),
  teamController.joinTeam
);

router.post(
  "/teams/:teamId/invitations",
  authenticate,
  requireRole("student"),
  validate(inviteMemberSchema),
  teamController.inviteMember
);

router.post(
  "/invitations/:invitationId/accept",
  authenticate,
  requireRole("student"),
  teamController.acceptInvitation
);

router.post(
  "/teams/:teamId/leave",
  authenticate,
  requireRole("student"),
  teamController.leaveTeam
);

router.get(
  "/hackathons/:hackathonId/my-team",
  authenticate,
  requireRole("student"),
  teamController.getMyTeam
);

router.get(
  "/teams/:teamId",
  authenticate,
  requireRole("student"),
  teamController.getTeamById
);

module.exports = router;