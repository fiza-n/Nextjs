import UserModel from "../../../model/User";
import { z } from "zod";
import dbConnect from "../../../lib/dbConnect";
import { signInSchema } from "../../../Schema/signInSchema";

const VerifyCodeSchema = z.object({
  verifyCode: signInSchema,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    //validate with zod
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 500,
        },
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.codeExpiration) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified!",
        },
        {
          status: 200,
        },
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired. Please signup again to get a new one.",
        },
        {
          status: 400,
        },
      );
    } else if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid verification code. Please check the code and try again.",
        },
        {
          status: 400,
        },
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      {
        status: 500,
      },
    );
  }
}
