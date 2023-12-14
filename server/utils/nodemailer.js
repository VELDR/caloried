const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.PASSWORD,
  },
});

const sendPasswordResetEmail = async (to, token) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject: 'Password Reset',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; max-width: 30rem;">
    <h2>Reset Password Caloried</h2>
    <p>Looks like you forgot your password. Don't worry, we got you covered</p>
    <p>Simply click on the reset password button. You will need to enter your new password</p>
    <div style="text-align: center; margin: 20px 0;">

  <a
    href="${process.env.FRONTEND_BASE_URL}/${token}/reset-password"
    id="sendPassword"
    style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;"
    target="_blank">
    Reset Password
  </a>

    </div>
  </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.response);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

const sendOTPVerificationEmail = async (to, OTP) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to,
    subject: 'Welcome to Caloried! Confirm Your Email',
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; max-width: 30rem;">
    <h2>Welcome to Caloried!</h2>
    <p>Thank you for choosing Caloried to help you on your journey to better health and nutrition. We're excited to have you on board!</p>
    <p>To get started, please confirm your email address by entering the OTP below:</p>
    <div style="text-align: center; margin: 20px 0;">
    <h2
    style="
      background: rgb(163 230 53);
      margin: 0 auto;
      width: max-content;
      padding: 0 10px;
      color: #fff;
      border-radius: 4px;
    "
  >
     <b>${OTP}</b>
  </h2>
    </div>
  </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendOTPVerificationEmail,
};
