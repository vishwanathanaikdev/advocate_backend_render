const mongoose = require("mongoose");

const DriveCredentialSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: true },
    apiKey: { type: String, required: true },
    scopes: { type: String, required: true },
  },
  { timestamps: true }
);

const DriveCredential = mongoose.model("DriveCredential", DriveCredentialSchema);

module.exports = DriveCredential;
