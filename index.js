const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/ToDo";
mongoose
  .connect(
    DB_URL
    //   ,
    //   {
    //   useNewUrlParse: true,
    //   useUnifiedTopology: true,
    // }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/", taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
