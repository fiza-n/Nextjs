import UserModel from "../../../model/User"
import {z} from 'zod'
import dbConnect from "../../../lib/dbConnect"
import {signInSchema} from "../../../Schema/signInSchema"

const VerifyCodeSchema = z.object({
    verifyCode: signInSchema
})

export async function POST(request: Request){
    await dbConnect();

    try {
        const {username, code}  = await request.json();

        //validate with zod
        
    } catch (error) {
         console.error("Error verifying user", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
        {
            status: 500
        }
    )
    }
}