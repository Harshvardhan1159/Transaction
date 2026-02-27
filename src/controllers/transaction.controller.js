const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");







async function createTransaction(req, res) {
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
    if (!fromAccount || !toAccount || !amount || idempotencyKey) {
        return res.status(400).json({
            message: "All fields are required",
            success: false,
        })
        const fromUseraccount = await accountModel.findById(fromAccount);
        const toUseraccount = await accountModel.findById(toAccount);
        if (!fromUseraccount || !toUseraccount) {
            return res.status(400).json({
                message: "Account not found",
                success: false,
            })
        }
        if (fromUseraccount.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance",
                success: false,
            })
        }
        const transaction = await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
        })
        return res.status(200).json({
            message: "Transaction created successfully",
            success: true,
            transaction,
        })
    }

}