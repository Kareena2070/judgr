const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["TEAM_INVITATION"],
            required: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true,
        },

        read: {
            type: Boolean,
            default: false,
        },

        invitationStatus: {
            type: String,
            enum: ["PENDING", "ACCEPTED", "EXPIRED"],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Notification", notificationSchema);