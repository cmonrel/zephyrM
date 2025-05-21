const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { generateJWT } = require("../../helpers/jwt");

const loginUser = async (req, res = response) => {
  //TODO: Registrar hora y fecha del inicio de sesión

  const { email } = req.body;

  try {
    const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });
    user.counter = 0;

    // Save user
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(202).json({
      ok: true,
      uid: user.id,
      name: user.name,
      role: user.role,
      counter: user.counter,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid, name } = req;

  try {
    const { role } = await User.findById(uid);

    // Generate JWT
    const token = await generateJWT(uid, name);

    res.status(200).json({
      ok: true,
      uid,
      name,
      role,
      token,
    });
  } catch (error) {}
};

const blockUser = async (req, res = response) => {
  //TODO: Registrar hora y fecha del block
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    user.blocked = true;
    user.counter = 0;

    // Save user
    await user.save();

    res.status(200).json({
      ok: true,
      user,
      msg: "user blocked successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error blocking user",
    });
  }
};

const validateRoleUser = async (req, res = response) => {
  const { email } = req.body;
  console.log(email);
  try {
    // const user = await User.findOne({ email });
    // if (user.role === "admin") {
    //   res.status(200).json({
    //     ok: true,
    //     msg: "user validated successfully",
    //   });
    // }
    res.status(400).json({
      ok: false,
      msg: "user not admin",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

module.exports = {
  loginUser,
  renewToken,
  blockUser,
  validateRoleUser,
};
