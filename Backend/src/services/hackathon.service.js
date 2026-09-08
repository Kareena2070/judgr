const Hackathon = require("../models/Hackathon.model");
const ApiError = require("../utils/ApiError.js");

const deriveEffectiveStatus = (hackathon, now = new Date()) => {
  if (now < hackathon.registrationStart) {
    return "DRAFT";
  }

  if (now < hackathon.registrationEnd) {
    return "REGISTRATION";
  }

  if (now < hackathon.submissionEnd) {
    return "SUBMISSION";
  }

  if (now < hackathon.judgingEnd) {
    return "JUDGING";
  }

  return "COMPLETED";
};

const createHackathon = async (data, userId) => {
  const hackathon = await Hackathon.create({
    title: data.title,
    description: data.description,
    theme: data.theme,
    registrationStart: data.registrationStart,
    registrationEnd: data.registrationEnd,
    submissionStart: data.submissionStart,
    submissionEnd: data.submissionEnd,
    judgingStart: data.judgingStart,
    judgingEnd: data.judgingEnd,
    teamSize: data.teamSize,
    createdBy: userId,
  });

  return {
    ...hackathon.toObject(),
    status: deriveEffectiveStatus(hackathon),
  };
};

const listHackathons = async ({ page, limit, status, search }) => {
  const skip = (page - 1) * limit;

  const filter = {};

  const now = new Date();

  if (status === "DRAFT") {
    filter.registrationStart = { $gt: now };
  } else if (status === "REGISTRATION") {
    filter.registrationStart = { $lte: now };
    filter.registrationEnd = { $gt: now };
  } else if (status === "SUBMISSION") {
    filter.submissionStart = { $lte: now };
    filter.submissionEnd = { $gt: now };
  } else if (status === "JUDGING") {
    filter.judgingStart = { $lte: now };
    filter.judgingEnd = { $gt: now };
  } else if (status === "COMPLETED") {
    filter.judgingEnd = { $lte: now };
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { theme: { $regex: search, $options: "i" } },
    ];
  }

  const [hackathons, total] = await Promise.all([
    Hackathon.find(filter).skip(skip).limit(limit),

    Hackathon.countDocuments(filter),
  ]);

  const result = hackathons.map((hackathon) => ({
    ...hackathon.toObject(),
    status: deriveEffectiveStatus(hackathon),
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    items: result,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

const getHackathonById = async (id) => {
  const hackathon = await Hackathon.findById(id);

  if (!hackathon) {
    return null;
  }

  return {
    ...hackathon.toObject(),
    status: deriveEffectiveStatus(hackathon),
  };
};

const updateHackathon = async (id, updates) => {
  const hackathon = await Hackathon.findById(id);

  if (!hackathon) {
    throw new ApiError(404, "HACKATHON_NOT_FOUND", "Hackathon not found");
  }

  const currentStatus = deriveEffectiveStatus(hackathon);

  const dateFields = [
    "registrationStart",
    "registrationEnd",
    "submissionStart",
    "submissionEnd",
    "judgingStart",
    "judgingEnd",
  ];

  const lockedAfterRegistration = ["teamSize", ...dateFields];

  const lockedAfterJudging = [
    "title",
    "description",
    "theme",
    "teamSize",
    ...dateFields,
  ];

  const hasUpdate = (fields) =>
    fields.some((field) => updates[field] !== undefined);

  if (
    ["REGISTRATION", "SUBMISSION"].includes(currentStatus) &&
    hasUpdate(lockedAfterRegistration)
  ) {
    throw new ApiError(
      400,
      "HACKATHON_FIELDS_LOCKED",
      "Team size and dates cannot be changed after registration has started",
    );
  }

  if (
    ["JUDGING", "COMPLETED"].includes(currentStatus) &&
    hasUpdate(lockedAfterJudging)
  ) {
    throw new ApiError(
      400,
      "HACKATHON_EDITING_LOCKED",
      "Hackathon cannot be modified during or after judging",
    );
  }

  // Only allow known/safe fields to be updated
  const allowedFields = [
    "title",
    "description",
    "theme",
    "registrationStart",
    "registrationEnd",
    "submissionStart",
    "submissionEnd",
    "judgingStart",
    "judgingEnd",
    "teamSize",
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      hackathon[field] = updates[field];
    }
  }

  // Re-run model validation against the complete resulting document
  await hackathon.validate();

  const updatedHackathon = await hackathon.save();

  return {
    ...updatedHackathon.toObject(),
    status: deriveEffectiveStatus(updatedHackathon),
  };
};

module.exports = {
  deriveEffectiveStatus,
  createHackathon,
  listHackathons,
  getHackathonById,
  updateHackathon,
};
