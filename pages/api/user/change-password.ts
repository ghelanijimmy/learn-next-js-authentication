import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";

interface ChangePasswordRequest extends NextApiRequest {
  body: {
    oldPassword: string;
    newPassword: string;
  };
}

interface ChangePasswordResponse extends NextApiResponse {
  message: string;
}

export default async function handler(
  req: ChangePasswordRequest,
  res: ChangePasswordResponse
) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const { oldPassword, newPassword } = req.body;
  const userEmail = session.user!.email;

  //connect to db
  const client = await connectToDatabase();
  const db = client.db().collection("users");
  //find user
  const existingUser = await db.findOne({ email: userEmail });
  //verify old password
  if (!existingUser) {
    res.status(404).json({ message: "User not found!" });
    return;
  }

  const currentPassword = existingUser.password;

  const isVerifiedPassword = await verifyPassword(oldPassword, currentPassword);

  if (!isVerifiedPassword) {
    res.status(403).json({ message: "Invalid password!" });
    return;
  }

  //hash new password
  const hashedPassword = await hashPassword(newPassword);
  //update password
  await db.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );
  //close db connection
  await client.close();
  res.status(200).json({ message: "Password updated!" });
}
