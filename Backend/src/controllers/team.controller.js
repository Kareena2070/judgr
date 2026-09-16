const teamService = require("../services/team.service.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../middlewares/asyncHandler.js");

const createTeam = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;
  const { name } = req.validated.body;

  const team = await teamService.createTeam({
    hackathonId,
    userId: req.user.sub,
    name,
  });

  return res
    .status(201)
    .json(new ApiResponse(team, "Team created successfully"));
});

const joinTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const membership = await teamService.joinTeam({
    teamId,
    userId: req.user.sub,
  });

  return res
    .status(201)
    .json(new ApiResponse(membership, "Joined team successfully"));
});

const inviteMember = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { email } = req.validated.body;

  const notification = await teamService.inviteMember({
    teamId,
    userId: req.user.sub,
    email,
  });

  return res
    .status(201)
    .json(new ApiResponse(notification, "Team invitation sent successfully"));
});

const acceptInvitation = asyncHandler(async (req, res) => {
  const { invitationId } = req.params;

  const membership = await teamService.acceptInvitation({
    invitationId,
    userId: req.user.sub,
  });

  return res
    .status(201)
    .json(new ApiResponse(membership, "Invitation accepted successfully"));
});

const leaveTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const result = await teamService.leaveTeam({
    teamId,
    userId: req.user.sub,
  });

  return res
    .status(200)
    .json(new ApiResponse(result, "Left team successfully"));
});

const getMyTeam = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;

  const team = await teamService.getMyTeam({
    hackathonId,
    userId: req.user.sub,
  });

  return res
    .status(200)
    .json(new ApiResponse(team, "My team fetched successfully"));
});

const getMyPendingInvitations = asyncHandler(async (req, res) => {
  const invitations = await teamService.getMyPendingInvitations({
    userId: req.user.sub,
  });

  return res
    .status(200)
    .json(new ApiResponse(invitations, "Invitations fetched successfully"));
});

const getTeamById = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await teamService.getTeamById({
    teamId,
  });

  return res
    .status(200)
    .json(new ApiResponse(team, "Team fetched successfully"));
});

const getTeamsByHackathon = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;

  const teams = await teamService.getTeamsByHackathon({
    hackathonId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        teams,
        "Teams fetched successfully"
      )
    );
});

module.exports = {
  createTeam,
  joinTeam,
  inviteMember,
  acceptInvitation,
  leaveTeam,
  getMyTeam,
  getMyPendingInvitations,
  getTeamById,
  getTeamsByHackathon,
};
