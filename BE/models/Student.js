const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true },
    class: { type: String, required: true },
    relative: { type: String, required: true },
    relativePhone: { type: String, required: true },
    school: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
