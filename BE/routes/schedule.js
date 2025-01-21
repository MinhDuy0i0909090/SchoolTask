const router = require("express").Router();
const Schedule = require("../models/Schedule");
//Get all schedule
router.get("/", async (req, res) => {
  try {
    const schedule = await Schedule.find();
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Add a new Schedule
router.post("/", async (req, res) => {
  console.log("Incoming request body:", req.body);

  const {
    title,
    start,
    end,
    hourlyRate,
    class: scheduleClass,
    school,
  } = req.body;

  try {
    const newSchedule = new Schedule({
      title,
      start,
      end,
      hourlyRate,
      class: scheduleClass,
      school,
    });
    const savedSchedule = await newSchedule.save();
    res.status(201).json(savedSchedule);
  } catch (error) {
    console.error("Error saving schedule:", error.message);
    res.status(400).json({ message: error.message, error: error });
  }
});
// Update a Schedule
router.put("/:id", async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { ...req.body, class: req.body.ScheduleClass },
      { new: true }
    );
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Schedule
router.delete("/:id", async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: "Schedule deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
