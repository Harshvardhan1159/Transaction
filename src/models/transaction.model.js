const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: true,
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "success", "failed", "reverse"],
            message: "Invalid status"
        },
        default: "pending"
    },
    idempotencyKey: {
        type: String,
        required: true,
        index: true,
        unique: true,
    }

}, {
    timestamps: true
})
const transactionModel = mongoose.model("transactionModel", transactionSchema);
module.exports = transactionModel;