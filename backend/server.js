const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const verifyToken = require("./middleware/authMiddleware");
const ec2Routes = require("./routes/ec2Routes");
const ebsRoutes = require("./routes/ebsRoutes");
const rdsRoutes = require("./routes/rdsRoutes");

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/aws", ec2Routes);
app.use("/api/aws", ebsRoutes);
app.use("/api/aws", rdsRoutes);

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully 🔐",
    user: req.user,
  });
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send("Database connected successfully 🚀");
  } catch (err) {
    res.status(500).send("Database connection failed ");
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});