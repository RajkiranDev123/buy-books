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

// transporter.verify() makes an SMTP request/connection. It contacts Gmail's SMTP server to check:
// Can it authenticate using SMTP_MAIL and SMTP_PASSWORD
// verify() does not send an email. It only tests the transporter configuration/connection.

transporter.verify((error, success) => {
  if (error) {
    console.log(" email error ==>", error.message);
    console.log("Gmail service is not ready, please check the config.");
  } else {
    console.log("Gmail service is ready to send the mail.");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {

  const res = await transporter.sendMail({

    // If you omit from, Nodemailer automatically uses the authenticated Gmail account as the sender
    
    from: `Buy Books  <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    html: body

  });

  return res;

};

///////////////////////////////////////////////////////////////////////////////////////////////

export const sendVerificationToEmail = async (to: string, verificationToken: string) => {

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const html = `

  <h1>Welcome to Buy Books! Verify your email.</h1>
  <p>Thanks for registering. Please click the link below to verify your email</p>
  <a href="${verificationUrl}">Verify your Email Here</a>

  `;

  const res = await sendEmail(to, "Please verify your email to access Buy Books.", html)
  
  return res;

};


export const sendResetPasswordLinkToEmail = async ( to: string, token: string) => {

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
  <h1>Welcome to your Buy Books! Reset your Password.</h1>
  <p>Click the link below to reset your password</p>
  <a href="${resetUrl}">Reset Password Here</a>
  `;

  await sendEmail(to, "Please reset your password.", html);

};
