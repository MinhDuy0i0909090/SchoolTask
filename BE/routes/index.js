const express = require("express");
const studentRoute = require("./students");
const classRoute = require("./classes");
const scheduleRoute = require("./schedule");
const eventRoute = require("./events");
const attendanceRoute = require("./attendance");
const authRoute = require("./user");

const router = express.Router();

router.use("/students", studentRoute);
router.use("/classes", classRoute);
router.use("/schedules", scheduleRoute);
router.use("/events", eventRoute);
router.use("/attendance", attendanceRoute);
router.use("/auth", authRoute);


module.exports = router;
