import mongoose from "mongoose"

const accountSchema = new mongoose.Schema({
  id: { type: String, default: mongoose.Types.ObjectId },
  userId: String,
  type: String,
  provider: String,
  providerAccountId: String,
  refresh_token: String,
  access_token: String,
  expires_at: Number,
  token_type: String,
  scope: String,
  id_token: String,
  session_state: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', accountSchema);
