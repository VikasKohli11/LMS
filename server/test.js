// File: testInsert.js
import mongoose from 'mongoose'

// TODO: Replace with your actual MongoDB Atlas connection string
const MONGO_URI = "mongodb+srv://VikasLMS:vikas123@cluster0.nrat1av.mongodb.net/lms";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Create a simple schema for testing
const testSchema = new mongoose.Schema({
  name: String,
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

const TestModel = mongoose.model("Test", testSchema);

// Insert random data
async function insertRandomData() {
  try {
    const randomData = new TestModel({
      name: "User_" + Math.floor(Math.random() * 1000),
      age: Math.floor(Math.random() * 100)
    });

    const result = await randomData.save();
    console.log("Data Inserted Successfully:", result);
    process.exit(0);
  } catch (error) {
    console.error("Insert Error:", error);
    process.exit(1);
  }
}

insertRandomData();
