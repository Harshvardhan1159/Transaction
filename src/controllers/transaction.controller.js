const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const mongoose = require("mongoose");








async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        })
        const fromUseraccount = await accountModel.findById({ _id: fromAccount });
        const toUseraccount = await accountModel.findById({ _id: toAccount });
        if (!fromUseraccount || !toUseraccount) {
            return res.status(400).json({
                message: "Account not found",
                success: false,
            })
        }
        const isTransactionExist = await transactionModel.findOne({
            idempotencyKey: idempotencyKey,
        })
        if (isTransactionExist) {
            if (isTransactionExist.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already completed",
                    success: true,
                })
            }
            if (isTransactionExist.status === "FAILED") {
                return res.status(200).json({
                    message: "Transaction already failed",
                    success: true,
                })
            }
            if (isTransactionExist.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction already pending",
                    success: true,
                })
            }
            if (isTransactionExist.status === "REVERSED") {
                return res.status(200).json({
                    message: "Transaction already reversed",
                    success: true,
                })
            }
        }
        if (fromUseraccount.status !== "ACTIVE" || toUseraccount.status !== "ACTIVE") {
            return res.status(400).json({
                message: "Account is not active",
                success: false,
            })
        }


    }
    const balance = await fromUseraccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance",
            success: false,
        })
    }
    const session = await mongoose.startSession();
    session.startTransaction()

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    }, { session })

    const debitLedgerEntry = await ledgerModel.create({
        account: fromAccount,
        transaction: transaction._id,
        amount: amount,
        type: "DEBIT",
    }, { session })

    const creditLedgerEntry = await ledgerModel.create({
        account: toAccount,
        transaction: transaction._id,
        amount: amount,
        type: "CREDIT",
    }, { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })
    session.endSession()
    return res.status(200).json({
        message: "Transaction completed",
        success: true,
    })



}

module.exports = {
    createTransaction,
}
