import htmlToText from 'html-to-text';
import nodemailer from 'nodemailer';
import config from '../config';
import pug from 'pug';
import amqp from 'amqplib';

export async function sendMailDataToQueue(emailData) {
  const conn = await amqp.connect(config.rabbitmqHost);
  const channel = await conn.createChannel();
  const queue = config.rabbitmqQueueMail;

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(emailData)), { persistent: true });

  setTimeout(() => {
    channel.close();
    conn.close();
  }, 500);
}

export async function startWorkerSendMail() {
  try {
    const conn = await amqp.connect(config.rabbitmqHost);
    const channel = await conn.createChannel();
    const queue = config.rabbitmqQueueMail;

    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async msg => {
      if (msg !== null) {
        const emailData = JSON.parse(msg.content.toString());
        await sendEmail(emailData);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error starting worker:', error);
  }
}

export const sendEmail = async (emailData) => {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
      user: config.smtpUsername,
      pass: config.smtpPassword,
    },
  });

  const html = pug.renderFile(`${__dirname}/../views/mail/${emailData.template}.pug`, {
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
