const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://ahad:ahad@cluster0.2a6hqdk.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));