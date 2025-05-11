const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../../../auth/models/User");
const { generateJWT } = require("../../../helpers/jwt");

const getUsers = async (req, res = response) => {
  try {
    const users = await User.find().populate("name", "email");
    const usersMapped = users.map((user) => {
      return {
        uid: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      };
    });
    res.status(200).json({
      ok: true,
      usersMapped,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error getting users",
    });
  }
};

const createUser = async (req, res = response) => {
  const { password } = req.body;

  try {
    const user = new User(req.body);
    user.blocked = false;
    user.counter = 0;

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user
    await user.save();

    // Generate JWT
    const token = await generateJWT(user.id, user.name);

    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Please contact admins",
    });
  }
};

const updatePassword = async (req, res = response) => {
  const { password } = req.body;
  const uid = req.params.id;
  console.log(password);

  try {
    const user = await User.findById({ _id: uid });
    user.password = password;

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Save user
    await user.save();

    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error updating password",
    });
  }
};

const updateUser = async (req, res = response) => {
  const uid = req.params.id;
  const user = req.body;

  try {
    await User.findByIdAndUpdate({ _id: uid }, req.body);

    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error updating user",
    });
  }
};

const deleteUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    await User.findByIdAndDelete({ _id: uid });
    res.status(200).json({
      ok: true,
      msg: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error deleting user",
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  updatePassword,
  updateUser,
  deleteUser,
};
