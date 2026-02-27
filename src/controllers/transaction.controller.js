const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");







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

}