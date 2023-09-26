import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DB_URL = process.env.MONGO_URL;
    const conn = await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`DB connected - ${conn.connection.host}`);
  } catch (error) {
    console.log(`DB connection failed - ${error.message}`);
    process.exit();
  }
};

export default connectDB;
