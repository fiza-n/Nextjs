import {email, z} from "zod";

export const usernameValidation = z
.string()
.min(2, "Username must be atleast 2 characters")
.max(20, "Username must be less than 20 characters")
.regex(/^[a-zA-Z0-9]+$/, "Username must not contain special characters");

export const emailValidation = z.
string()
.includes("@", "Email must contain @ symbol")
.endsWith(".com", "Email must end with .com domain");

export const passwordValidation = z
.string()
.min(6 , "Password must be atleast 6 characters")
.max(10, "Password must be less than 10 characters");

export const signUpSchema = z.object({
    username: usernameValidation,
    password: passwordValidation,
    email: emailValidation

})