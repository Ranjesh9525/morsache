import mongoose from "mongoose"

const sessionSchema = new mongoose.Schema({
  sessionToken: { type: String, unique: true },
  userId: String,
  expires: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model('Session', sessionSchema);
