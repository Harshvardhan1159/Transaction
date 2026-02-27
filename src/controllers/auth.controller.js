const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

// POST /api/auth/register
async function userRegisterController(req, res) {
    const { email, name, password } = req.body;
    const isExisted = await userModel.findOne({ email });
    if (isExisted) {
        return res.status(400).json({
            message: "User already exists",
            success: false,

        });
    }
    const user = await userModel.create({ email, name, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token);
    return res.status(200).json({
        message: "User registered successfully",

        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    });
}

// POST /api/auth/login
async function userLoginController(req, res) {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(400).json({
            message: "User not found",
            success: false,
        });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password",
            success: false,
        });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token);
    return res.status(200).json({
        message: "User logged in successfully",
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        },
        token
    });
}

module.exports = { userRegisterController, userLoginController };