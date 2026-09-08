const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError.js");

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    theme: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    status: {
      type: String,
      enum: ["DRAFT", "REGISTRATION", "SUBMISSION", "JUDGING", "COMPLETED"],
      default: "DRAFT",
    },

    registrationStart: {
      type: Date,
      required: true,
    },

    registrationEnd: {
      type: Date,
      required: true,
    },

    submissionStart: {
      type: Date,
      required: true,
    },

    submissionEnd: {
      type: Date,
      required: true,
    },

    judgingStart: {
      type: Date,
      required: true,
    },

    judgingEnd: {
      type: Date,
      required: true,
    },

    teamSize: {
      min: {
        type: Number,
        required: true,
        min: 1,
      },
      max: {
        type: Number,
        required: true,
        min: 1,
      },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

hackathonSchema.pre("validate", function () {
  if (
    this.registrationStart &&
    this.registrationEnd &&
    this.registrationStart >= this.registrationEnd
  ) {
    throw new ApiError(
      400,
      "INVALID_HACKATHON_DATES",
      "Registration start must be before registration end",
    );
  }

  if (
    this.registrationEnd &&
    this.submissionStart &&
    this.registrationEnd > this.submissionStart
  ) {
    throw new ApiError(
      400,
      "INVALID_HACKATHON_DATES",
      "Registration must end before submission starts",
    );
  }

  if (
    this.submissionStart &&
    this.submissionEnd &&
    this.submissionStart >= this.submissionEnd
  ) {
    throw new ApiError(
      400,
      "INVALID_HACKATHON_DATES",
      "Submission start must be before submission end",
    );
  }

  if (
    this.submissionEnd &&
    this.judgingStart &&
    this.submissionEnd > this.judgingStart
  ) {
    throw new ApiError(
      400,
      "INVALID_HACKATHON_DATES",
      "Submission must end before judging starts",
    );
  }

  if (
    this.judgingStart &&
    this.judgingEnd &&
    this.judgingStart >= this.judgingEnd
  ) {
    throw new ApiError(
      400,
      "INVALID_HACKATHON_DATES",
      "Judging start must be before judging end",
    );
  }

  if (
    this.teamSize &&
    this.teamSize.min !== undefined &&
    this.teamSize.max !== undefined &&
    this.teamSize.min > this.teamSize.max
  ) {
    throw new ApiError(
      400,
      "INVALID_TEAM_SIZE",
      "Team size minimum cannot be greater than maximum",
    );
  }
});

hackathonSchema.index({
  status: 1,
  registrationStart: 1,
});

module.exports = mongoose.model("Hackathon", hackathonSchema);