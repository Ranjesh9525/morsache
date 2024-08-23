import NextAuth, { AuthOptions, Theme,Account,Profile, User ,Session ,CallbacksOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { Adapter, AdapterUser } from "next-auth/adapters";
import { MongooseAdapter } from "@choutkamartin/mongoose-adapter";
import { randomInt } from "crypto";
import { createTransport } from "nodemailer";
import { JWT } from "next-auth/jwt";
import UserModel  from "@/models/User";
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
  registered?:boolean
  data?:{
    password?:string
    firstName?:string
    lastName?:string
    email?:string
  }
}
//   adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
const senderName = process.env.SMTP_FROM_NAME;
const senderEmail = process.env.SMTP_FROM;
const sender = `"${senderName}" <${senderEmail}>`;

export const authOptions: AuthOptions = {
  adapter: MongooseAdapter(process.env.DBURL || "") as Adapter,
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
  },
  providers: [
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
    signOut:"/"
  },
  callbacks: {
    async signIn({ user,data,registered}: CustomSignIn) {
      try {
        await connectDB()
        // Check if the user already exists in the database
        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) {
          console.log("User already exists in the database");
                await disconnectDB()
          return existingUser;
        }
        // if(!registered){
          
        //   return `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`
        // }else{
      
            console.log("New user - Redirecting to register page");
            const newUser = new UserModel({
              email: user.email,
            });
            // const hashedPassword = await bcrypt.hash(data!.password!, 12);
            //  const newUser = new UserModel({
            // email: user.email,
            // firstName: data.firstName,
            // lastName: data.lastName,
            // password: hashedPassword,
            // emailVerified: new Date(),
            //  });
          await newUser.save();
          console.log("New user created and saved ");
          return newUser;
        
          
      } catch (error:any) {
        console.error("Error saving user :", error.message);
        throw new Error("Failed to save user ");
      }
    },
    // emailVerification: async({ user, url }) => {
    //   const { host } = new URL(url);

    // },

   session:async({session,token,user}:{ session: Session; token: JWT; user: AdapterUser; }) =>{
      // Fetch user data from the database and set it in the session
      const userData = await UserModel.findOne({ email: user?.email });
      if (userData) {
        session.user = userData;
      }
      return session;
    },
  
    jwt: async({token, user}: { token: JWT; user: User}) => {
        const userData: UserDocument = await UserModel.findOne({ email: user.email });
        user && (token.user = userData);
        console.log("token - User:", token);
        return Promise.resolve(token );
    }
    }
}

function gernerateOTP() {
  return randomInt(100000, 999999);
}

function html(params: { token: string; host: string }) {
  const { token, host } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>Morsache</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center"><strong>Sign in code:</strong> ${token}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Keep in mind that this code will expire after <strong><em>3 minutes</em></strong>. If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
  `;
}

function text(params: { token: string; host: string }) {
  return `
  Sign in to ${params.host}
  
  Sign in code: ${params.token}
  
  Keep in mind that this code will expire after 3 minutes. If you did not request this email you can safely ignore it.
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

    //   return true;
    // async signIn(user, account, profile) {
    //   // Perform actions after user signs in
    // },
    // async session(session, user) {
    //   // Fetch user data from the database and set it in the session
    //   const userData = await User.findOne({ email: user.email });
    //   if (userData) {
    //     session.user = userData;
    //   }
    //   return session;
    // },