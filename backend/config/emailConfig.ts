import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("gmail service is not ready, plz check the config.");
  } else {
    console.log("gmail service is ready to send the mail.");
  }
});

const sendEmail = async (to: string, subject: string, body: string) => {
  await transporter.sendMail({
    from: `Buy Books  <${process.env.SMTP_MAIL}>`,
    to,
    subject,
    html: body,
  });
};

const sendVerificationToEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
  
  
  `;
  await sendEmail(to, "Plz verify your email to access Buy Books", html);
};

const sendResetPasswordLinkToEmail = async (to: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const html = `
  
  
  `;

  await sendEmail(to, "Plz verify your email to access Buy Books", html);
};
