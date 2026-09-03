import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs"; // genSalt , hash

export interface IUSER extends Document {
  name: string;
  email: string;
  password?: string; // "abc" or undefined if omitted , const user = {} and user.password is undefined
  googleId?: string;
  profilePicture?: string;
  phoneNumber?: string;
  isVerified: boolean;
  verificationToken?: string | null;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date; // Stores when the password-reset token expires.
  agreeTerms: boolean;
  addresses: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>; // This is NOT a function, it’s just a method signature (type declaration)
  // const comparePassword = (candidatePassword: string) : Promise<boolean> => {} // type declaration vs actual function implementation syntax.
}
// Promise is generic (Promise<T>) , But You filled T = boolean
// Promise<boolean> , here No flexibility is left → concrete type / fixed result type

// "This schema represents an IUSER."
// "Documents returned by this User model are IUSER documents."
//  So TypeScript can understand things like: user?.randomProperty;     // ❌ TypeScript error

const userSchema = new Schema<IUSER>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // required not mentioned 
    googleId: { type: String },
    profilePicture: { type: String, default: null }, // When default is there, don’t use required
    phoneNumber: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    agreeTerms: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    //“Field exists, but has no value” : null
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    addresses: [{ type: Schema.Types.ObjectId, ref: "Address" , default: undefined }],
    // user can have multiple Address documents, and addresses stores their MongoDB IDs.
    // if i do await User.create({   name: "John",  email: "john@gmail.com" }) then in db no ==> address:[]
  },
  { timestamps: true },
);

// userSchema Defines database fields only, not methods ==> comparePassword(candidatePassword: string): Promise<boolean>;

// this = current DB record (document)

// pre("save") runs right before .save() or .create() writes data to the database
userSchema.pre("save", async function () {
  // 'this' is the document
  if (!this.isModified("password")) return; 
  // When a document is loaded or saved : original password = "123" and
  // When you change something : this.password = "1234"
  // Mongoose tracks changes internally on every document.

  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password!, salt);
});

// The ! tells TypeScript: “Trust me, this value is not null or undefined here.” : non-null assertion operator.
// It essentially overrides TypeScript’s type checking for this line.
// ! does NOT add runtime safety — it only silences TypeScript.
// If password is actually undefined at runtime : your app will crash.

userSchema.methods.comparePassword = async function ( candidatePassword: string ): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// user is an instance of your Mongoose model (a document from the User collection).

// The comparePassword method is called on this instance, so this inside the method refers to that particular user document.

export default mongoose.model<IUSER>("User", userSchema);

//  const salt =  Promise.resolve(5);
//  console.log(salt) ==> Promise { 5 }

//  const salt = await Promise.resolve(5);
//  console.log(salt) ==> 5

// Promise.resolve(5).then(salt => {
//   console.log(salt);
// });

// pre : middleware , runs by itself and methods ==> manual (you call it)
