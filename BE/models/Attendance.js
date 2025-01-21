const mongoose = require("mongoose");
const Student = require("./Student");
const attendanceSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  students: [Student.schema],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
