import NextAuth, {
  AuthOptions,
  Theme,
  Account,
  Profile,
  User,
  Session,
  CallbacksOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { Adapter, AdapterUser } from "next-auth/adapters";
import { MongooseAdapter } from "@choutkamartin/mongoose-adapter";
import { randomInt } from "crypto";
import { createTransport } from "nodemailer";
import { JWT } from "next-auth/jwt";
import UserModel from "@/models/User";
import { connectDB, disconnectDB } from "@/utilities/DB";
import { UserDocument } from "@/@types/user";
import { NextApiRequest } from "next";
import bcrypt from "bcryptjs";
import { signOut } from "next-auth/react";

interface CustomSignIn {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile | undefined;
  email?: { verificationRequest?: boolean | undefined } | undefined;
  credentials?: Record<string, any> | undefined;
  registered?: boolean;
  data?: {
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}
//   adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
const senderName = process.env.SMTP_FROM_NAME;
const senderEmail = process.env.SMTP_FROM;
const sender = `"${senderName}" <${senderEmail}>`;
// const sender = `${senderName}`;

export const authOptions: AuthOptions = {
  adapter: MongooseAdapter(process.env.DBURL || "") as Adapter,
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        // secureConnection: false,
        service: process.env.SMTP_SERVICE,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: sender,
      maxAge: 3 * 60, // 3 minutes
      async generateVerificationToken() {
        return gernerateOTP().toString();
      },
      async sendVerificationRequest({
        identifier: email,
        token,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        const transport = createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Your OTP to sign in to Morsache `,
          text: text({ token, host }),
          html: html({ token, host }),
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },
  callbacks: {
    async signIn({ user, data, registered, account, profile }: CustomSignIn) {
      try {
        await connectDB();
        if (account && account.provider === "google") {
          if (profile) {
            const existingUser = await UserModel.findOne({
              email: profile.email,
            });
            if (existingUser) {
              return existingUser;
            }
            const newUser = new UserModel({
              email: profile.email,
              image: profile.image,
              emailVerified: Date.now(),
              firstName: profile.name,
            });
            await newUser.save();
            return newUser;
          }
        }
        //normal signin
        // Check if the user already exists in the database
        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
          return existingUser;
        }

        const newUser = new UserModel({
          email: user.email,
        });

        await newUser.save();
        return newUser;
      } catch (error: any) {
        console.error("Error saving user :", error.message);
        throw new Error("Failed to save user ");
      }
    },

    jwt: async ({ token, user }: { token: JWT; user: User }) => {
      const userData: UserDocument = await UserModel.findOne({
        email: user.email,
      });
      user && (token.user = userData);
      // console.log("token - User:", token);
      return Promise.resolve(token);
    },
    session: async ({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: AdapterUser;
    }) => {
      console.log(user);
      const userData = await UserModel.findOne({ email: token?.email });
      if (userData) {
        session.user = userData;
      }
      return session;
    },
  },
};

function gernerateOTP() {
  return randomInt(100000, 999999);
}

export function html(params: { token: string; host: string }) {
  const { token, host } = params;
  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const escapedHost = host.replace(/\./g, "&#8203;.");
  // console.log(host)
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Morsache</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
    div[style*="margin: 16px 0;"] { margin: 0 !important; }
  </style>
</head>
<body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td bgcolor="#3b3838" align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="480" >
          <tr>
            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
              <img alt="Morsache Logo" src="https://morsache.vercel.app/morsache-clothing-logo-small.png" width="100" height="100" style="display: block; width: 100px; max-width: 100px; min-width: 100px; font-family: 'Poppins', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td bgcolor="#3b3838" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480" >
          <tr>
            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; text-transform:uppercase; line-height: 48px;">
              <h1 style="font-size: 28px; font-weight: 600; margin: 0;">Sign in to Morsache</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480" >
          <tr>
            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">Your sign-in code is:</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" align="left">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                    <table border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="border-radius: 3px;" bgcolor="#3b3838">
                          <span style="font-size: 36px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #3b3838; display: inline-block;">${token}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">This code will expire in <strong>3 minutes</strong>. If you didn't request this email, you can safely ignore it.</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <p style="margin: 0;">Cheers,<br>The Morsache Team</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480" >
          <tr>
            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
              <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
              <p style="margin: 0;"><a href="${escapedHost}" target="_blank" style="color: #3b3838;">We&rsquo;re here to help you out</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
        <table border="0" cellpadding="0" cellspacing="0" width="480" >
          <tr>
            <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
              <p style="margin: 0;">You received this email because we received a request for sign-in for your account. If you didn't request sign-in you can safely delete this email.</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Poppins', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;">
              <p style="margin: 0;">Morsache, dwarka sector 7, New Delhi 110077</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function text(params: { token: string; host: string }) {
  return `
Sign in to Morsache

Your sign-in code is: ${params.token}

This code will expire in 3 minutes. If you didn't request this email, you can safely ignore it.

Need more help? Visit ${params.host}

Cheers,
The Morsache Team
  `;
}
// async signIn({ user, account, profile, email, credentials }) {
//   const verificationRequest = email.verificationRequest;
//   if (verificationRequest) {
//     const EMAIL_WHITELIST = ["whitelisted_email.hotmail.com"];
//     const { email: emailAddress } = user;
//     if (!EMAIL_WHITELIST.includes(emailAddress)) {
//       console.log("Invalid email address - not allowed to sign in");
//       return false;
//     }
//   }
