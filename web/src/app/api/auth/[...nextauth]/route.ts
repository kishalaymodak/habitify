import NextAuth from "next-auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
interface Credentials {
  Email: string;
  Password: string;
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        Email: { label: "Email", type: "text", placeholder: "" },
        Password: { label: "Password", type: "password", placeholder: "" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials || !credentials.Email || credentials.Password) {
          throw new Error("email and password are requred");
        }

        const userEmail = credentials.Email;
        const password = credentials.Password;
        console.log(userEmail);
        try {
          const user = await prisma.user.findUnique({
            where: {
              userEmail,
            },
          });
          if (!user || !user.password) {
            throw new Error("Invalide credentials");
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }

          console.log("user ");
          return {
            id: user.id,
            email: user.userEmail,
          };
        } catch (error) {
          console.log("next auth error" + error);

          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(params) {
      if (!params.user.email) {
        return false;
      }

      try {
        const exsistingUser = await prisma.user.findUnique({
          where: {
            userEmail: params.user.email,
          },
        });
        if (!exsistingUser)
          await prisma.user.create({
            data: {
              userEmail: params.user.email,
            },
          });
      } catch (error) {
        console.error("next auth error ", error);
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
