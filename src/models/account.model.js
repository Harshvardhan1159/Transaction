const mongoose = require("mongoose");
const legderModel = require("./ledger.model");

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

accountSchema.methods.getBalance = async function () {
    const balanceData = await legderModel.aggregate([
        {
            $match: {
                account: this._id
            }
        },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ["$totalCredit", "$totalDebit"]
                }
            }
        }
    ])
    if (balanceData.length === 0) {
        return 0;
    }
    return balanceData[0].balance;
}

const accountModel = mongoose.model("accountModel", accountSchema);

module.exports = accountModel;


