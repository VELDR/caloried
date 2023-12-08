const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.PASSWORD,
  },
});

const sendVerificationEmail = async (to, verificationLink) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject: 'Welcome to Caloried! Confirm Your Email',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; max-width: 30rem;">
    <h2>Welcome to Caloried!</h2>
    <p>Thank you for choosing Caloried to help you on your journey to better health and nutrition. We're excited to have you on board!</p>
    <p>To get started, please confirm your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${verificationLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;">
        Verify Email
      </a>
    </div>
  </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendPasswordResetEmail = async (to, temporaryPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject: 'Password Reset',
    text: `Your temporary password is: ${temporaryPassword}\nPlease change your password after logging in.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.response);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
