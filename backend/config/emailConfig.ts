import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("email error ==>", error);
    console.log("gmail service is not ready, plz check the config.");
  } else {
    console.log("gmail service is ready to send the mail.");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {
 const res= await transporter.sendMail({
    from: `Buy Books  <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    html: body,
  });
  return res
};

export const sendVerificationToEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
  <h1>Welcome to your Buy Books! Verify your email.</h1>
  <p>Thanks for registering. Please click link below to verify your email</p>
  <a href="${verificationUrl}">Verify Email Here</a>
  `;
  const res=await sendEmail(to, "Plz verify your email to access Buy Books", html);
  return res
};

const sendResetPasswordLinkToEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
  <h1>Welcome to your Buy Books! Reset your Password.</h1>
  <p>Click the link below to reset your password</p>
  <a href="${resetUrl}">Reset Password Here</a>
  `;
  await sendEmail(to, "Plz reset your password", html);
};
