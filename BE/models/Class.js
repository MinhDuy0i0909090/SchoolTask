const mongoose = require("mongoose");

const classSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    school: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
