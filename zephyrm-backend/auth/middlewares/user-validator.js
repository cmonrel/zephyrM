const { response } = require("express");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userAlreadyExist = async ({ body }, res = response, next) => {
  const { email } = body;

  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

  if (user) {
    return res.status(400).json({
      ok: false,
      msg: "User already exists",
    });
  }

  next();
};

const userExists = async (req, res = response, next) => {
  const { uid } = req.body;
  const _id = uid;
  const user = await User.findById(_id);

  if (!user) {
    return res.status(400).json({
      ok: true,
      msg: "User don't exists",
    });
  }

  next();
};

const validatingUser = async (req, res = response, next) => {
  const { email, password } = req.body;

  if (email.length === 0 || password.length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "Password and email are required",
    });
  }

  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

  if (!user) {
    return res.status(400).json({
      ok: false,
      msg: "User or password are incorrect",
    });
  }

  const { blocked } = user;

  if (blocked) {
    return res.status(400).json({
      ok: false,
      msg: "User is blocked, please contact admins",
    });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    user.counter += 1;
    await user.save();

    return res.status(400).json({
      ok: false,
      counter: user.counter,
      msg: "Email or password are incorrect",
    });
  }

  next();
};

const validBlocking = async ({ body }, res = response, next) => {
  const { email } = body;

  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });

  if (!user) {
    return res.status(400).json({
      ok: false,
      msg: "User not found",
    });
  }

  const { counter, blocked } = user;

  if (blocked) {
    return res.status(400).json({
      ok: false,
      msg: "User is already blocked",
    });
  }

  if (counter < 5) {
    return res.status(400).json({
      ok: false,
      msg: "User can't be blocked",
    });
  }

  next();
};

const validRole = (req, res = response, next) => {
  const { role } = req.body;

  if (role !== "admin" && role !== "worker") {
    return res.status(400).json({
      ok: false,
      msg: "Role not valid",
    });
  }
  next();
};

module.exports = {
  userAlreadyExist,
  userExists,
  validBlocking,
  validatingUser,
  validRole,
};
