import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { API, USER, CHAT } from "./constants.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.use(API + USER, userRoutes);
app.use(API + CHAT, chatRoutes);
app.use(notFound);
app.use(errorHandler);

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
