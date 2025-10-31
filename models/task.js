const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  taskDescription: { type: String, required: true },
  createdTime: { type: Date, default: Date.now },
  completedTime: { type: Date, default: null },
  //Working with date felt bit tough so I went with just time.. in future I will update it with date
  softDelete: { type: Boolean, default: false },
  status: { type: Boolean, default: false }, //false na task complete aagala
});

module.exports = mongoose.model("Task", taskSchema);
