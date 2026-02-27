const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["active", "frozen", "inactive"],
            message: "Invalid status"

        },
        default: "active"

    },
    cuurency: {
        type: String,
        required: true,
        default: "INR"
    },


}, {
    timestamps: true
})

accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model("accountModel", accountSchema);

module.exports = accountModel;


