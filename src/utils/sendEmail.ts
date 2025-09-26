const { MailtrapClient } = require("mailtrap");

const client = new MailtrapClient({ token: process.env.TOKEN! });
const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

export const sendEmail = (recipient: string, url: string) => {
  client
    .send({
      from: sender,
      to: [
        {
          email: recipient,
        },
      ],
      subject: "You are awesome!",
      text: `Congrats for sending test email with Mailtrap! ${url}`,
      category: "Integration Test",
    })
    .then(console.log, console.error);
};
