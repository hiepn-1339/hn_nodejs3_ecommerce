import htmlToText from 'html-to-text';
import nodemailer from 'nodemailer';
import config from '../config';
import pug from 'pug';

export const sendEmail = async (emailData, template) => {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
      user: config.smtpUsername,
      pass: config.smtpPassword,
    },
  });

  const html = pug.renderFile(`${__dirname}/../views/mail/${template}.pug`, {
    emailData,
  });

  const mailOptions = {
    from: 'fruitables',
    to: emailData.email,
    subject: emailData.subject,
    html,
    text: htmlToText.fromString(html),
  };

  await transporter.sendMail(mailOptions);
};
