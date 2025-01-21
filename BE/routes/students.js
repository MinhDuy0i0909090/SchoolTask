const router = require("express").Router();
const Student = require("../models/Student");
//Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Add a new student
router.post("/", async (req, res) => {
  console.log("Incoming request body:", req.body);

  const {
    name,
    gender,
    email,
    class: studentClass,
    relative,
    relativePhone,
    school,
    date,
  } = req.body;

  try {
    const newStudent = new Student({
      name,
      gender,
      email,
      class: studentClass,
      relative,
      relativePhone,
      school,
      date,
    });
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Error saving student:", error.message);
    res.status(400).json({ message: error.message, error: error });
  }
});
// Update a student
router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { ...req.body, class: req.body.studentClass },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Student
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
