const router = require("express").Router();
const Event = require("../models/Event");
//Get all event
router.get("/", async (req, res) => {
  try {
    const event = await Event.find();
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Add a new Event
router.post("/", async (req, res) => {
  console.log("Incoming request body:", req.body);

  const { date, time, title, content } = req.body;

  try {
    const newEvent = new Event({
      date,
      time,
      title,
      content,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error saving Event:", error.message);
    res.status(400).json({ message: error.message, error: error });
  }
});
// Update a Event
router.put("/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a Event
router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
