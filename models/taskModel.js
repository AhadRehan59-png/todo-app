const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"]
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters"]
    },

    // ✅ STATUS
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending"
    },

    // ✅ DUE DATE (NEW)
    dueDate: {
      type: Date,
      default: null
    },

    // ✅ PRIORITY (NEW)
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },

    // ✅ SOFT DELETE (PRO FEATURE)
    isDeleted: {
      type: Boolean,
      default: false
    },

    // ✅ USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);