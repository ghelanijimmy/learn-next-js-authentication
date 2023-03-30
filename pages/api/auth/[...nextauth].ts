import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
export default NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({
          email: credentials?.email,
        });

        if (!user) {
          await client.close();
          throw new Error("No user found!");
        }

        const isVerifiedPassword = await verifyPassword(
          credentials?.password as string,
          user.password
        );

        if (!isVerifiedPassword) {
          await client.close();
          throw new Error("Could not log you in!");
        }

        await client.close();

        return { email: user.email, id: user._id.toString() };
      },
    }),
  ],
});
