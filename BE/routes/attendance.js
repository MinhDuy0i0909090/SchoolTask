const router = require("express").Router();
const Attendance = require("../models/Attendance");

// Get all attendance records
router.get("/", async (req, res) => {
  try {
    const attendances = await Attendance.find();
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new attendance record
router.post("/", async (req, res) => {
  const { timestamp, students } = req.body;

  try {
    // Ensure required fields are present
    if (!timestamp || !students || students.length === 0) {
      return res
        .status(400)
        .json({ message: "All fields are required: timestamp, students" });
    }

    const newAttendance = new Attendance({ timestamp, students });
    const savedAttendance = await newAttendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an attendance record by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an attendance record by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
