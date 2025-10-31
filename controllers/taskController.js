const Task = require("../models/task");
const User = require("../models/user");
//updation
const editTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { taskName, taskDescription, status, softDelete } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        sucess: false,
        message: "Task not found !",
      });
    }

    if (softDelete) {
      //doubt: before softDelete, I set it to softDelete === true, but it didn't work ?
      task.softDelete = softDelete;
      await task.save();
      return res.status(200).json({
        success: true,
        message: "Task successfully deleted!",
        task,
      });
    }

    if (taskName) task.taskName = taskName;
    if (taskDescription) task.taskDescription = taskDescription;
    if (status) {
      task.status = status;
      task.completedTime = Date.now();
    }
    await task.save();
    res.status(200).json({
      success: true,
      message: "Task updated successfully!",
      task,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error!");
  }
};

//View their tasks
const viewTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({
      path: "tasks",
      match: { softDelete: false, status: false },
    });
    if (!user) {
      return res.status(404).json({
        success: true,
        message: "User not found !",
      });
    }
    console.log(user.tasks);
    res.status(200).json({
      message: "Tasks: ",
      tasks: user.tasks,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

//create Task
const createTask = async (req, res) => {
  try {
    const { taskName, taskDescription } = req.body;
    const userId = req.user.userId;
    const task = new Task({
      taskName,
      taskDescription,
    });
    await task.save();

    //adding task to user
    const user = await User.findById(userId);
    user.tasks.push(task._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Task successfully created!",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

const viewDeletedTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({
      path: "tasks",
      match: { softDelete: true },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tasks: ",
      tasks: user.tasks,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

const viewCompletedTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({
      path: "tasks",
      match: { status: true, softDelete: false },
    });
    if (!user) {
      return res.status(404).json({
        success: true,
        message: "User not found !",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tasks: ",
      tasks: user.tasks,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};

//For testing
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({
      success: true,
      tasks,
    });
  } catch (err) {
    console.error(err.message);
    res.satus(500).json("server error");
  }
};

module.exports = {
  editTask,
  createTask,
  viewTasks,
  viewDeletedTasks,
  viewCompletedTasks,
  getAllTasks,
};
