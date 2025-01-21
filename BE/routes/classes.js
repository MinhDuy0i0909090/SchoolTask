const router = require("express").Router();
const Class = require("../models/Class");

// Get all classes
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new class
router.post("/", async (req, res) => {
  const { name, school, date } = req.body;

  try {
    // Ensure required fields are present
    if (!name || !school || !date) {
      return res
        .status(400)
        .json({ message: "All fields are required: name, school, date" });
    }

    const newClass = new Class({ name, school, date });
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a class by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a class by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
