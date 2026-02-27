const moongose = require('mongoose');

const ledgerSchema = new moongose.Schema({
    account: {
        type: moongose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: true,
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: true,
        imutable: true
    },
    transaction: {
        type: moongose.Schema.Types.ObjectId,
        ref: "transactionModel",
        required: true,
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["credit", "debit"],
            message: "Invalid type"
        },
        required: true,
        immutable: true
    }
})

function preventLedgerMofification() {
    throw new Error("Ledger cannot be modified");

}
ledgerSchema.pre("save", preventLedgerMofification);
ledgerSchema.pre("update", preventLedgerMofification);
ledgerSchema.pre("delete", preventLedgerMofification);
ledgerSchema.pre("findOneAndUpdate", preventLedgerMofification);
ledgerSchema.pre("findOneAndDelete", preventLedgerMofification);
ledgerSchema.pre("updateOne", preventLedgerMofification);
ledgerSchema.pre("deleteMany", preventLedgerMofification);

const ledgerModel = moongose.model("ledgerModel", ledgerSchema);
module.exports = ledgerModel;
