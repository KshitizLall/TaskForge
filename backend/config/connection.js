const mongoose = require("mongoose");

async function connectMongoDb() {
  try {
    await mongoose.connect(
      "mongodb+srv://kszzz96:Yq5GNIMlZWMutQew@kshitiz-cluster-0.a3bzcku.mongodb.net/taskforge"
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}

module.exports = {
  connectMongoDb,
};
