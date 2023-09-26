import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("Inside register user....");
  console.log("yha a gya");
  console.log(req.body);
  const { name, email, password, pic } = req.body;
  console.log("data le liya");
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the mandatory fields!");
  }
  const userExist = await User.findOne({ email });
  console.log("userExist - " + userExist);
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
  console.log("user ko daal rhe hai");
  const user = await newUser.save();
  console.log("user - " + user);
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

const getAllUsers = async (req, res) => {};

export { registerUser, loginUser, getAllUsers };
