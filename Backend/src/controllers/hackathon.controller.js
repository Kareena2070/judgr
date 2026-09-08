const hackathonService = require("../services/hackathon.service");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../middlewares/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");

const createHackathonController = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    theme,
    registrationStart,
    registrationEnd,
    submissionStart,
    submissionEnd,
    judgingStart,
    judgingEnd,
    teamSize,
  } = req.validated.body;

  const userId = req.user.sub;

  const hackathon = await hackathonService.createHackathon(
    {
      title,
      description,
      theme,
      registrationStart,
      registrationEnd,
      submissionStart,
      submissionEnd,
      judgingStart,
      judgingEnd,
      teamSize,
    },
    userId,
  );

  return res
    .status(201)
    .json(new ApiResponse(hackathon, "Hackathon created successfully"));
});

const listHackathonsController = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.validated.query;

  const result = await hackathonService.listHackathons({
    page,
    limit,
    status,
    search,
  });

  return res
    .status(200)
    .json(new ApiResponse(result, "Hackathons fetched successfully"));
});

const getHackathonByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const hackathon = await hackathonService.getHackathonById(id);

  if (!hackathon) {
    throw new ApiError(404, "HACKATHON_NOT_FOUND", "Hackathon not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(hackathon, "Hackathon fetched successfully"));
});

const updateHackathonController = asyncHandler(async (req, res) => {
  const { id } = req.validated.params;
  const updates = req.validated.body;

  const hackathon = await hackathonService.updateHackathon(id, updates);

  return res
    .status(200)
    .json(new ApiResponse(hackathon, "Hackathon updated successfully"));
});

module.exports = {
  createHackathonController,
  listHackathonsController,
  getHackathonByIdController,
  updateHackathonController,
};
