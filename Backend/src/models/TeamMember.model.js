const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema(
    {
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        hackathonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hackathon",
            required: true,
        },

        role: {
            type: String,
            enum: ["leader", "member"],
            required: true,
            default: "member",
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    }
);

teamMemberSchema.index(
    { userId: 1, hackathonId: 1 },
    { unique: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);