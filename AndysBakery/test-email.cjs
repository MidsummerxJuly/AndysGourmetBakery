require("dotenv").config({ path: ".env" });

const nodemailer = require("nodemailer");

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const result = await transporter.sendMail({
    from: `"Andy’s Bakery Test" <${process.env.SMTP_USER}>`,
    to: process.env.BAKERY_ORDER_EMAIL,
    subject: "Andy’s Bakery email test",
    text: "If you received this, email sending works.",
  });

  console.log("Email sent!");
  console.log("Accepted:", result.accepted);
  console.log("Message ID:", result.messageId);
}

main().catch((error) => {
  console.error("Email test failed:");
  console.error(error);
});