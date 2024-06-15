import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

var ownerEmail = process.env.OWNER_EMAILID_FOR_MAIL;
var password = process.env.OWNER_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ownerEmail,
      pass: password,
    },
  });

export const sendEmailUser = async (email, subject, html, message) => {
    try {
      const mailOptions = {
        from: ownerEmail,
        to: email,
        subject: subject,
        html: html,
      };
  
      const info = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            reject({ message: "Email not found", status: 400 });
          } else {
            console.log("Email sent: " + info.response);
            resolve({ message: message, status: 200 });
          }
        });
      });
  
      return info;
    } catch (error) {
      console.error("Error in sending email:", error);
      throw { message: "Error in sending email", status: 500 };
    }
};
