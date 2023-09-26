import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { API, USER } from "./constants.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.use(API + USER, userRoutes);

const PORT = process.env.SERVER_PORT || 9211;

app.get("/api/chat", async (req, res) => {
  console.log("inside get chat function");
  res.status(200).json({
    message: "Chats received successfully",
    data: [
      {
        message: "Gaand mara",
        id: 1,
      },
      {
        message: "Tu ma chuda",
        id: 2,
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
