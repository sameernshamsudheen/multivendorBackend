import nodemailer from "nodemailer";
import "dotenv/config";
import ejs from "ejs";
import fs from "fs";
import ApiError from "./apierror.js";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: `${process.env.MAIL_SMTP_SERVER}`,
    host: `${process.env.MAIL_SMTP_HOST}`,
    port: `${process.env.MAIL_PORT}`,
    secure: true,
    auth: {
      user: `${process.env.MAIL_USER}`,
      pass: `${process.env.MAIL_PASS}`,
    },
  });

  const { email, subject, template, data } = options;

  const templateContent = fs.readFileSync(template, "utf-8");
  const renderedTemplate = ejs.render(templateContent, data);
  try {
    const result = await transporter.sendMail({
      from: process.env.MAIL_USER, // Your email address
      to: email, // Recipient's email address
      subject: subject,
      html: renderedTemplate, // Rendered HTML content from the template
    });
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

export default sendMail;
