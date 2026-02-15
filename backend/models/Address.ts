import mongoose, { Document, Schema } from "mongoose";


export interface IADDRESS extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  profilePicture?: string;
  phoneNumber?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  agreeTerms: boolean;
  addresses: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const addressSchema = new Schema<IADDRESS>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    profilePicture: { type: String, default: null },
    phoneNumber: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    agreeTerms: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" }],
  },
  { timestamps: true },
);



export default mongoose.model<IADDRESS>("Address", addressSchema);

