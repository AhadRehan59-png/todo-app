const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const Task = require("../models/taskModel");


// 🔹 DASHBOARD
router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const baseQuery = {
      user: req.user._id,
      isDeleted: false
    };

    const totalTasks = await Task.countDocuments(baseQuery);
    const completedTasks = await Task.countDocuments({ ...baseQuery, status: "completed" });
    const pendingTasks = await Task.countDocuments({ ...baseQuery, status: "pending" });
    const highPriority = await Task.countDocuments({ ...baseQuery, priority: "high" });

    res.render("dashboard", {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriority
    });

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});


// 🔹 GET TASKS (Pagination + Sorting + Filter + Search)
router.get("/tasks", isLoggedIn, async (req, res) => {
  try {
    const { search = "", status, priority, sort = "latest" } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    let query = {
      user: req.user._id,
      isDeleted: false
    };

    // 🔍 SEARCH
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // 📌 STATUS FILTER
    if (status && status !== "all") {
      query.status = status;
    }

    // 📌 PRIORITY FILTER
    if (priority && priority !== "all") {
      query.priority = priority;
    }

    // 🔽 SORTING (UPDATED 🔥)
    let sortOption = {};

    if (sort === "latest") {
      sortOption = { createdAt: -1 };
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "completed") {
      sortOption = { status: 1 };
    } else if (sort === "priority") {
      sortOption = { priority: -1 };
    } else if (sort === "az") {
      sortOption = { title: 1 };   // 🔥 A → Z
    } else if (sort === "za") {
      sortOption = { title: -1 };  // 🔥 Z → A
    } else {
      sortOption = { createdAt: -1 };
    }

    const total = await Task.countDocuments(query);

    const tasks = await Task.find(query)
      .collation({ locale: "en", strength: 2 }) // ✅ case-insensitive sorting
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.render("list", {
      tasks,
      search,
      status,
      priority,
      sort,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      message: req.flash("success"),
      error: req.flash("error")
    });

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});


// 🔹 ADD PAGE
router.get("/tasks/add", isLoggedIn, (req, res) => {
  res.render("add-task", {
    message: req.flash("success"),
    error: req.flash("error")
  });
});


// 🔹 ADD TASK
router.post("/tasks/add", isLoggedIn, async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;

    await Task.create({
      title,
      description,
      dueDate: dueDate || null,
      priority: priority || "low",
      status: "pending",
      isDeleted: false,
      user: req.user._id
    });

    req.flash("success", "Task added successfully");
    res.redirect("/tasks");

  } catch (err) {
    console.log(err);
    req.flash("error", "Error adding task");
    res.redirect("/tasks");
  }
});


// 🔹 EDIT PAGE
router.get("/tasks/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDeleted: false
    });

    if (!task) {
      req.flash("error", "Task not found");
      return res.redirect("/tasks");
    }

    res.render("edit-task", { task });

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});


// 🔹 UPDATE TASK
router.post("/tasks/edit/:id", isLoggedIn, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title,
        description,
        status: status || "pending",
        priority: priority || "low",
        dueDate: dueDate || null
      },
      { new: true }
    );

    if (!updated) {
      req.flash("error", "Task update failed");
      return res.redirect("/tasks");
    }

    req.flash("success", "Task updated successfully");
    res.redirect("/tasks");

  } catch (err) {
    console.log(err);
    req.flash("error", "Error updating task");
    res.redirect("/tasks");
  }
});


// 🔹 TOGGLE STATUS
router.get("/tasks/toggle/:id", isLoggedIn, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) return res.redirect("/tasks");

    task.status = task.status === "pending" ? "completed" : "pending";

    await task.save();

    res.redirect("/tasks");

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});


// 🔹 DELETE (SOFT)
router.get("/tasks/delete/:id", isLoggedIn, async (req, res) => {
  try {
    await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDeleted: true }
    );

    req.flash("success", "Task deleted");
    res.redirect("/tasks");

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});


// 🔹 DELETE MULTIPLE
router.post("/tasks/delete-multiple", isLoggedIn, async (req, res) => {
  try {
    const ids = req.body.taskIds;

    await Task.updateMany(
      {
        _id: { $in: Array.isArray(ids) ? ids : [ids] },
        user: req.user._id
      },
      { isDeleted: true }
    );

    req.flash("success", "Tasks deleted");
    res.redirect("/tasks");

  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});


// 🔹 DB FIX
router.get("/fix-db", async (req, res) => {
  await Task.updateMany(
    {},
    {
      $set: {
        status: "pending",
        priority: "low",
        dueDate: null,
        isDeleted: false
      }
    }
  );

  res.send("Database Fixed ✅");
});

module.exports = router;