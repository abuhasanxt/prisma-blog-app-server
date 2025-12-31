import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.APP_USER,

    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp:true,
    autoSignInAfterVerification:true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
  try {
        const verificationUrl=`${process.env.APP_URL}/verify-email?token=${token}`
      const info = await transporter.sendMail({
        from: '"Prima Blog " <prismablog@gmail.com>',
        to: user.email,
        subject: "Please verify your email!",
      
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: #4f46e5;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .btn {
        display: inline-block;
        margin: 25px 0;
        padding: 14px 24px;
        background: #4f46e5;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        background: #f4f6f8;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777777;
      }
      .link {
        word-break: break-all;
        font-size: 13px;
        color: #4f46e5;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h2>Prima Blog</h2>
      </div>

      <div class="content">
        <h3>Verify your email address</h3>

        <p>
          Hi ${user.name}<br />
          Thank you for signing up for <strong>Prima Blog</strong>.
        </p>

        <p>
          Please confirm your email address by clicking the button below:
        </p>

        <a href="${verificationUrl}" class="btn">
          Verify Email
        </a>

        <p>
          If the button doesn’t work, copy and paste this link into your browser:
        </p>

        <p class="link">${url}</p>

        <p>
          If you did not create an account, you can safely ignore this email.
        </p>

        <p>
          Thanks,<br />
          <strong>Prima Blog Team</strong>
        </p>
      </div>

      <div class="footer">
        © 2025 Prima Blog. All rights reserved.
      </div>
    </div>
  </body>
</html>
`
      });

      console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error(err)
    throw err;
  }
    },
  },
   socialProviders: {
        google: { 
          prompt: "select_account consent",
          accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
});
