const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const taskController = require("../controllers/taskController");

const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

//signup
router.post("/signup", userController.signUp);

//login
router.post("/login", userController.login);

//getUser
router.get("/getUser", authenticateToken, userController.getUser);

//addTask
router.post("/createTask", authenticateToken, userController.createTask);

//viewTasks
router.get("/viewTasks", authenticateToken, userController.viewPendingTasks);

//Edit Task
router.put("/editTask/:taskId", authenticateToken, userController.editTask);

//view Deleted Tasks
router.get("/deletedTasks", authenticateToken, userController.viewDeletedTasks);

//view completed Tasks
router.get(
  "/completedTasks",
  authenticateToken,
  userController.viewCompletedTasks
);
module.exports = router;
