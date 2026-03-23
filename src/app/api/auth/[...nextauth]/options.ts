import {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export const authOptions : NextAuthOptions = {
    providers:[
         CredentialsProvider({
            id:  "credentials",
            name: "Credentials",
            credentials: {
            email: { label: "Email", type: "type" },
            password: {label: "Password", type: "password"}
            },
            async authorize(credentials: any):Promise<any> {
                await dbConnect() 
                try {
                    const user = UserModel.findOne({

                        $or : [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    }
                    )
                    if(!user){
                        throw new Error("No user found with the provided email or username")
                    }
                } catch (error: any) {
                    
                }
            }
         })
    ]
}