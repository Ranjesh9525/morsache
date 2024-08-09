import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  identifier: String,
  token: { type: String, unique: true },
  expires: Date,
}, { timestamps: true });


export default mongoose.models.VerificationToken ||  mongoose.model('VerificationToken', verificationTokenSchema);
