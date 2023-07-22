const mongoose = require("mongoose");
const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

exports.mongoconnect = () => {
    // Connect to MongoDB
    mongoose
        .connect(MONGO_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Mongo connection established");
        })
        .catch((e) => {
            console.log("Mongo connection failed");
            console.error(e);
        });
};
