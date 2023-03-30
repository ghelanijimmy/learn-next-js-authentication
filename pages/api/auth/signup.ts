import { connectToDatabase } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { hashPassword } from "@/lib/auth";

interface SignupRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}
export default async function handler(
  req: SignupRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 7
    ) {
      res.status(422).json({
        message:
          "Invalid input - password should be at least 7 characters long",
      });
    } else {
      const hashedPassword = await hashPassword(password);
      const newUser = {
        email,
        password: hashedPassword,
      };

      const client = await connectToDatabase();

      const db = client.db();

      const existingUsers = await db.collection("users").findOne({ email });

      if (existingUsers) {
        res.status(422).json({ message: "User exists already!" });
        await client.close();
      } else {
        await db.collection("users").insertOne(newUser);

        res.status(201).json({ message: "Created user!" });
        await client.close();
      }
    }
  }
  res
    .status(500)
    .json({ message: "Error. This endpoint doesn't support a GET API Call" });
}
