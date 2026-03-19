import { sendEmailVerification } from "@/src/helpers/sendEmailVerification";
import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/User";
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username,email, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne(
            {
                username,
                isVerified : true
            }
        )
        if(existingUserVerifiedByUsername) { 
            return Response.json({
                success: false,
                message: "User already exist with this username"
            },
        {
            status: 400
        })
        }
        const existingUserVerifiedByEmail =  await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserVerifiedByEmail) {
            if(existingUserVerifiedByEmail.isVerified) {
                return Response.json({
                 success: false,
                message: "User already exist with this email"
            },{
                status: 400
            })
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserVerifiedByEmail.password = hashedPassword;
            existingUserVerifiedByEmail.verifyCode = verifyCode;
            existingUserVerifiedByEmail.codeExpiration = new Date(Date.now() + 3600000)
            await existingUserVerifiedByEmail.save();
        }
    }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                 username,
                  email,
                  password: hashedPassword,
                  verifyCode,
                  codeExpiration: expiryDate,
                  isVerified: false,
                  isAcceptingMessage: true,
                  message: []
            })

           await newUser.save()
        }

        //send email verification
        const emailResponse = await sendEmailVerification(
            email,
            username,
            verifyCode
        )
        if(!emailResponse.success) {
            return Response.json({
                 success: false,
                message: emailResponse.message
            },{
                status: 500
            })
        }
        return Response.json({
                 success: true,
                message: "User registered successfully."
            },{
                status: 201
            })

         } catch (error) {
        console.error("Error registering User", error);
        return Response.json(
            {
                success: false,
                message: "Error registering User",
            }, 
            {
                status: 500
            }
        )
    }
}