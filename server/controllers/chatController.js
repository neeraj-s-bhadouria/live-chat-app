import asyncHandler from "express-async-handler";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";

//  POST -> /api/chat
export const createChat = asyncHandler(async (req, res) => {
  console.log("inside the createChat function");
  const { userId } = req.body;
  if (!userId) {
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//  GET -> /api/chat
export const getAllChats = asyncHandler(async (req, res) => {
  console.log("Inside getAllChats function");
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//  POST -> /api/chat/group
export const createGroup = asyncHandler(async (req, res) => {
  console.log("Inside createGroup function");
  if (!req.body.users || !req.body.chatName) {
    return res.status(400).send("Please fill all the requied fields!");
  }
  const users = JSON.parse(req.body.users);
  //group chat should have atleast 2 members in it
  if (users.length < 2) {
    return res.status(400).send("A group chat should have more than 2 people");
  }
  //adding the logged in user in the chat
  users.push(req.user);
  if (await Chat.findOne({ chatName: req.body.chatName })) {
    return res.status(409).send("Group with this name already exists");
  }
  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

//  PUT -> /api/chat/group/add
export const addToGroup = asyncHandler(async (req, res) => {
  console.log("Inside addToGroup function");
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(500);
    throw new Error("Failed to add the user to the group");
  } else {
    res.status(200).json(added);
  }
});

//  PUT -> /api/chat/group/remove
export const removeFromGroup = asyncHandler(async (req, res) => {
  console.log("Inside removeFromGroup function");
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    res.status(500);
    throw new Error("Failed to remove user from the group");
  } else {
    res.status(200).json(removed);
  }
});

//  PUT -> /api/chat/group/rename
export const renameGroup = asyncHandler(async (req, res) => {
  console.log("Inside renamegroup function");
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.status(200).json(updatedChat);
  }
});
