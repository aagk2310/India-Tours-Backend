const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
// dotenv.config({ path: '../config.env' });
let transporter = nodemailer.createTransport({
  host: `${process.env.MAILTRAP_HOST}`,
  port: `${process.env.MAILTRAP_PORT}`,
  auth: {
    user: `${process.env.MAILTRAP_USER}`,
    pass: `${process.env.MAILTRAP_PASS}`,
  },
});

const generatePasswordChangeBodyHTML = (passwordResetToken, userName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #fff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .content {
            margin: 20px 0;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Dear ${userName},</p>
            <p>We received a request to reset your password. Please click the button below to reset your password:</p>
            <p style="text-align: center;">
                <a href="https://example.com/reset-password?token=YOUR_TOKEN_HERE" class="button">Reset Password</a>
            </p>
            <p>This link is valid for 10 minutes. If you did not request a password reset, please ignore this email or contact support.</p>
            <p>Thank you,</p>
            <p>India Tours</p>
        </div>
        
    </div>
</body>
</html>
`;

exports.sendMail = async function ({
  passwordResetToken,
  userName,
  userEmail,
}) {
  const info = await transporter.sendMail({
    from: '"Abhishek Agarwal" <aagk2310@gmail.com>',
    to: `${userEmail}`,
    subject: `Your password reset link (Valid for 10 minutes)`,
    html: `${generatePasswordChangeBodyHTML(passwordResetToken, userName)}`,
  });

  console.log('Message sent: %s', info.messageId);
};
