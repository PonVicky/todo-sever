const taskController = require("../controllers/taskController");
const express = require("express");
const router = express.Router();

// router.put("/editTask/:taskId", taskController.editTask);

router.get("/getAllTasks", taskController.getAllTasks);

module.exports = router;
