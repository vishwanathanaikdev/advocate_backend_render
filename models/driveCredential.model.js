import mongoose from "mongoose";

const DriveCredentialSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  clientSecret: { type: String, required: true },
  apiKey: { type: String, required: true },
  scopes: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("DriveCredential", DriveCredentialSchema);

