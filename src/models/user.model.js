const moongose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new moongose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email address"]
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },

}, {
    timestamps: true,
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(String(password), this.password);
};

const User = moongose.model("User", userSchema);

module.exports = User;      