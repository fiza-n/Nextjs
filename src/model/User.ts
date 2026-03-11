import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  codeExpiration: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    match: [/.+\@.+\..+/, "PLease provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    length: [6, "Password must be 6 characters or more"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },

  codeExpiration: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  message: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model("User", UserSchema);

export default UserModel;
