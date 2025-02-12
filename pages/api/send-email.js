import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'subhitcha.s@gmail.com', // Replace with your Gmail
    pass: 'Gamenest@123' // Generate from Google Account settings
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    await transporter.sendMail({
      from: 'subhitcha.s@gmail.com',
      to: email,
      subject: 'Invitation to GameNest',
      html: `
        <h1>You've been invited to GameNest!</h1>
        <p>Join us at: https://gamenest.com/join/123</p>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}