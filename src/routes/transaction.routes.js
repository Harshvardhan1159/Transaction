const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middleware/auth.middleware");
const transactionRoutes = Router();

transactionRoutes.post("/", authMiddleware, transferController);




module.exports = router;