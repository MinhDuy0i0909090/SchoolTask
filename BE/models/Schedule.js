const mongoose = require("mongoose");
const { Schema } = mongoose;

const scheduleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    class: {
      type: String,
      required: true,
      trim: true,
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Schedule", scheduleSchema);
