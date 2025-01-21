const { resend } = require("./config");
const {
  verificationTokenEmailTemplate,
  WELCOME_EMAIL_TEMPLATE,
} = require("./email_template");

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify Your Email Address Now",
      html: verificationTokenEmailTemplate.replace(
        "{verificationToken}",
        verificationToken
      ),
    });
  } catch (error) {
    console.log("error sending verification email", error);
    throw new Error("Error sending verification email");
  }
};
const sendWelcomeEmail = async (email, name) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to our company",
      html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name),
    });
  } catch (error) {
    console.log("error sending welcome email", error);
  }
};
const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password",
      html: `Click <a href="${resetURL}">here</a> to reset your password`,
    });
  } catch (error) {
    console.log("error sending password reset email", error);
  }
};
const sendResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset Was Successful",
      html: `Your password was reset successfully`,
    });
  } catch (error) {
    console.log("error sending password reset successful email", error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
