const express = require("express");
const { connection } = require("./db");
const { boardRouter } = require("./routes/board.routes");
const app = express();
app.use(express.json());

require("dotenv").config();
const port = process.env.PORT;

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

app.use("/boards", boardRouter);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Base Point of Kanban server" });
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log(`Server is running at ${port}`);
  } catch (error) {
    console.log("Error while connecting DB");
    console.log("error:", error);
  }
});
