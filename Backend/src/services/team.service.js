const Team = require("../models/Team.model.js");
const TeamMember = require("../models/TeamMember.model.js");
const Hackathon = require("../models/Hackathon.model.js");
const User = require("../models/User.model.js");
const Notification = require("../models/Notification.model.js");
const { deriveEffectiveStatus } = require("./hackathon.service.js");
const ApiError = require("../utils/ApiError.js");

const createTeam = async ({ hackathonId, userId, name }) => {
  const hackathon = await Hackathon.findById(hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "HACKATHON_NOT_FOUND", "Hackathon not found");
  }

  if (deriveEffectiveStatus(hackathon) !== "REGISTRATION") {
    throw new ApiError(
      400,
      "TEAMS_NOT_ACCEPTING",
      "Teams are not accepting registrations",
    );
  }

  const existingMembership = await TeamMember.findOne({
    userId,
    hackathonId,
  });

  if (existingMembership) {
    throw new ApiError(
      409,
      "ALREADY_IN_TEAM",
      "User is already a member of a team",
    );
  }

  const team = await Team.create({
    hackathonId,
    name,
    createdBy: userId,
  });

  await TeamMember.create({
    teamId: team._id,
    userId,
    hackathonId,
    role: "leader",
  });

  return team;
};

const joinTeam = async ({ teamId, userId }) => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new ApiError(404, "TEAM_NOT_FOUND", "Team not found");
  }

  const hackathon = await Hackathon.findById(team.hackathonId);

  if (!hackathon) {
    throw new ApiError(404, "HACKATHON_NOT_FOUND", "Hackathon not found");
  }

  if (deriveEffectiveStatus(hackathon) !== "REGISTRATION") {
    throw new ApiError(
      400,
      "TEAMS_NOT_ACCEPTING",
      "Teams are not accepting registrations",
    );
  }

  const existingMembership = await TeamMember.findOne({
    userId,
    hackathonId: team.hackathonId,
  });

  if (existingMembership) {
    throw new ApiError(
      409,
      "ALREADY_IN_TEAM",
      "User is already a member of a team",
    );
  }

  const memberCount = await TeamMember.countDocuments({
    teamId,
  });

  if (memberCount >= hackathon.teamSize.max) {
    throw new ApiError(
      409,
      "TEAM_FULL",
      "Team has reached its maximum capacity",
    );
  }

  // ⚠️ RACE CONDITION WINDOW:
  // Another request can pass the memberCount check
  // before this TeamMember is created.

  const membership = await TeamMember.create({
    teamId,
    userId,
    hackathonId: team.hackathonId,
    role: "member",
  });

  return membership;
};

const inviteMember = async ({ teamId, userId, invitedUserId }) => {
  const leaderMembership = await TeamMember.findOne({
    teamId,
    userId,
    role: "leader",
  });

  if (!leaderMembership) {
    throw new ApiError(
      403,
      "ONLY_TEAM_LEADER_CAN_INVITE",
      "Only the team leader can invite members"
    );
  }

  const team = await Team.findById(teamId);

if (!team) {
    throw new ApiError(
      404,
      "TEAM_NOT_FOUND",
      "Team not found"
    );
  }

  const hackathon = await Hackathon.findById(team.hackathonId);

 if (!hackathon) {
    throw new ApiError(
      404,
      "HACKATHON_NOT_FOUND",
      "Hackathon not found"
    );
  }

  if (deriveEffectiveStatus(hackathon) !== "REGISTRATION") {
    throw new ApiError(
      400,
      "TEAMS_NOT_ACCEPTING",
      "Teams are not accepting registrations"
    );
  }

  const invitedUser = await User.findById(invitedUserId);

  if (!invitedUser) {
    throw new ApiError(
      404,
      "USER_NOT_FOUND",
      "User not found"
    );
  }

  if (invitedUser.role !== "student") {
    throw new ApiError(
      400,
      "ONLY_STUDENT_CAN_BE_INVITED",
      "Only students can be invited to a team"
    );
  }

  const existingMembership = await TeamMember.findOne({
    userId: invitedUserId,
    hackathonId: team.hackathonId,
  });

 if (existingMembership) {
    throw new ApiError(
      409,
      "ALREADY_IN_TEAM",
      "User is already a member of a team"
    );
  }

  const notification = await Notification.create({
    recipient: invitedUserId,
    type: "TEAM_INVITATION",
    message: `${team.name} has invited you to join their team.`,
    teamId: team._id,
  });

  return notification;
};

const acceptInvitation = async ({ invitationId, userId }) => {
  const notification = await Notification.findById(invitationId);

  if (!notification) {
    throw new ApiError(
      404,
      "INVITATION_NOT_FOUND",
      "Invitation not found"
    );
  }

  if (notification.recipient.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "NOT_INVITATION_RECIPIENT",
      "You are not the recipient of this invitation"
    );
  }

  if (notification.type !== "TEAM_INVITATION") {
    throw new ApiError(
      400,
      "INVALID_INVITATION",
      "Invalid team invitation"
    );
  }

  if (notification.invitationStatus !== "PENDING") {
    throw new ApiError(
      409,
      "INVITATION_ALREADY_ACCEPTED",
      "Invitation has already been processed"
    );
  }

  const team = await Team.findById(notification.teamId);

  if (!team) {
    throw new ApiError(
      404,
      "TEAM_NOT_FOUND",
      "Team not found"
    );
  }

  const hackathon = await Hackathon.findById(team.hackathonId);

  if (!hackathon) {
    throw new ApiError(
      404,
      "HACKATHON_NOT_FOUND",
      "Hackathon not found"
    );
  }

  if (deriveEffectiveStatus(hackathon) !== "REGISTRATION") {
    throw new ApiError(
      400,
      "TEAMS_NOT_ACCEPTING",
      "Teams are not accepting registrations"
    );
  }

  const existingMembership = await TeamMember.findOne({
    userId,
    hackathonId: team.hackathonId,
  });

  if (existingMembership) {
    throw new ApiError(
      409,
      "ALREADY_IN_TEAM",
      "User is already a member of a team"
    );
  }

  const memberCount = await TeamMember.countDocuments({
    teamId: team._id,
  });

  if (memberCount >= hackathon.teamSize.max) {
    throw new ApiError(
      409,
      "TEAM_FULL",
      "Team has reached its maximum capacity"
    );
  }
  const membership = await TeamMember.create({
    teamId: team._id,
    userId,
    hackathonId: team.hackathonId,
    role: "member",
  });

  notification.invitationStatus = "ACCEPTED";
  await notification.save();

  return membership;
};

const leaveTeam = async ({ teamId, userId }) => {
  const membership = await TeamMember.findOne({
    teamId,
    userId,
  });

  if (!membership) {
    throw new ApiError(
      404,
      "NOT_TEAM_MEMBER",
      "User is not a member of this team"
    );
  }

  if (membership.role === "leader") {
    throw new ApiError(
      400,
      "LEADER_MUST_REASSIGN_BEFORE_LEAVING",
      "Team leader must reassign leadership before leaving"
    );
  }

  await TeamMember.deleteOne({
    _id: membership._id,
  });

  return {
    message: "TEAM_LEFT_SUCCESSFULLY",
  };
};

const getMyTeam = async ({ hackathonId, userId }) => {
  const membership = await TeamMember.findOne({
    hackathonId,
    userId,
  });

  if (!membership) {
    throw new ApiError(
      404,
      "TEAM_NOT_FOUND",
      "User is not a member of any team for this hackathon"
    );
  }

  const team = await Team.findById(membership.teamId);

  if (!team) {
    throw new ApiError(
      404,
      "TEAM_NOT_FOUND",
      "Team not found"
    );
  }

  return team;
};

const getTeamById = async ({ teamId }) => {
  const team = await Team.findById(teamId);

if (!team) {
    throw new ApiError(
      404,
      "TEAM_NOT_FOUND",
      "Team not found"
    );
  }

  return team;
};

module.exports = {
  createTeam,
  joinTeam,
  inviteMember,
  acceptInvitation,
  leaveTeam,
  getMyTeam,
  getTeamById,
};
