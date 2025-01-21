
const {Resend} = require("resend");
const dotenv = require("dotenv");

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Export the resend instance
module.exports.resend = resend;