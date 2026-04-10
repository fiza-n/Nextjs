import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "../../../model/User";
import dbConnect from "../../../lib/dbConnect";
import { User } from "next-auth";
import { success } from "zod";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
      return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
          status: 404,
        },
    );
}
const user: User = session.user;

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUserValue = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true },
    );
    if (!updatedUserValue) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accepting Messages",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "User status updated to accepting Messages",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("failed to update user status to accepting Messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accepting Messages",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
  
  const user: User = session.user;
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "failed to found the user",
        },
        {
          status: 404,
        },
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in getting accepting message status", error);
    return Response.json({
        success: false,
        message: "Error in getting accepting message status",
      },
      {
        status: 500,
      },
    )
  }
}
