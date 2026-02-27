const moongoose = require("mongoose");

function connectToDB() {
    moongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("connected to db");
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    })
}

module.exports = connectToDB;