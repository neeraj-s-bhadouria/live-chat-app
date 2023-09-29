import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/generateToken.js";

//  POST -> /api/user
const registerUser = asyncHandler(async (req, res) => {
  console.log("Inside register user....");
  console.log(req.body);
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the mandatory fields!");
  }
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(409);
    throw new Error("Email already exists.");
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  const newUser = new User({
    name,
    email,
    password: passwordHash,
    pic,
  });
  const user = await newUser.save();
  if (user) {
    res.status(201).json({
      mesaage: "Registration successfull",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id, user.name, user.email),
      },
    });
  } else {
    res.status(500);
    throw new Error(
      "Registration failed, try again later or contact helpdesk."
    );
  }
});

//  POST -> /api/user/login
const loginUser = asyncHandler(async (req, res) => {
  console.log("Inside login user function");
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and Password are manadatory");
  }
  const user = await User.findOne({ email }).lean();
  if (!user) {
    res.status(400);
    throw new Error("User does not exists");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Either email or password are incorrect");
  }
  delete user["password"];
  res.status(200).json({
    mesaage: "login successfull",
    data: {
      token: generateToken(user._id, user.name, user.email),
      user: user,
    },
  });
});

//  GET -> /api/user?search=:parameter
const getAllUsers = asyncHandler(async (req, res) => {
  console.log("inside getAllUsers function " + req.query.search);
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

export { registerUser, loginUser, getAllUsers };
