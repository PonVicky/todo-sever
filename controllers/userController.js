const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Task = require("../models/task");
const taskController = require("../controllers/taskController");

const config = require("../config/config");

//signup
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "EmailId already registered!", success: false });
    }
    user = new User({
      name,
      email,
      password,
    });

    const normalPassword = password;
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({
      success: true,
      message: "User signup successfully!",
      user: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found !",
      });
    }
    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(401).json({
        success: false,
        message: "Wrong password!",
      });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: "10d",
    });

    res.status(200).json({
      success: true,
      message: `Successfully logged in ${user.name}`,
      user,
      token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//view user
const getUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "User Found !",
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

//create tasks
const createTask = async (req, res) => {
  await taskController.createTask(req, res);
};

//signout will be done in front end by deleting the token
//Edit Task
const editTask = async (req, res) => {
  await taskController.editTask(req, res);
};
//should I write seperate api for deleting ?, because I already have editTask where we can make the softDelete true

//view Tasks
const viewPendingTasks = async (req, res) => {
  await taskController.viewTasks(req, res);
};

//view deleted Tasks
const viewDeletedTasks = async (req, res) => {
  await taskController.viewDeletedTasks(req, res);
};

//view completedTasks
const viewCompletedTasks = async (req, res) => {
  await taskController.viewCompletedTasks(req, res);
};

module.exports = {
  signUp,
  login,
  createTask,
  getUser,
  editTask,
  viewPendingTasks,
  viewDeletedTasks,
  viewCompletedTasks,
};
