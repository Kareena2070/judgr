const { z } = require("zod");

const createTeamSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Team name must be at least 2 characters")
      .max(100, "Team name cannot exceed 100 characters"),
  }),

  params: z.object({
    hackathonId: z
      .string()
      .min(1, "Hackathon ID is required"),
  }),

  query: z.object({}),
});


const inviteMemberSchema = z.object({
  body: z.object({
    invitedUserId: z
      .string()
      .min(1, "Invited user ID is required"),
  }),

  params: z.object({
    teamId: z
      .string()
      .min(1, "Team ID is required"),
  }),

  query: z.object({}),
});


module.exports = {
  createTeamSchema,
  inviteMemberSchema,
};