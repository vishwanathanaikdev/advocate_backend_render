const DriveCredential = require("../models/driveCredential.model");

// ✅ Create
const createCredential = async (req, res) => {
  try {
    const newCred = new DriveCredential(req.body);
    const saved = await newCred.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All
const getAllCredentials = async (req, res) => {
  try {
    const creds = await DriveCredential.find();
    res.json(creds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get One
const getCredentialById = async (req, res) => {
  try {
    const cred = await DriveCredential.findById(req.params.id);
    if (!cred) return res.status(404).json({ message: "Credential not found" });
    res.json(cred);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update
const updateCredential = async (req, res) => {
  try {
    const updated = await DriveCredential.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete
const deleteCredential = async (req, res) => {
  try {
    await DriveCredential.findByIdAndDelete(req.params.id);
    res.json({ message: "Credential deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Export all functions (CommonJS style)
module.exports = {
  createCredential,
  getAllCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
};







//===>> Old

// import DriveCredential from "../models/driveCredential.model.js";

// // ✅ Create
// export const createCredential = async (req, res) => {
//   try {
//     const newCred = new DriveCredential(req.body);
//     const saved = await newCred.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Get All
// export const getAllCredentials = async (req, res) => {
//   try {
//     const creds = await DriveCredential.find();
//     res.json(creds);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Get One
// export const getCredentialById = async (req, res) => {
//   try {
//     const cred = await DriveCredential.findById(req.params.id);
//     if (!cred) return res.status(404).json({ message: "Credential not found" });
//     res.json(cred);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Update
// export const updateCredential = async (req, res) => {
//   try {
//     const updated = await DriveCredential.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ✅ Delete
// export const deleteCredential = async (req, res) => {
//   try {
//     await DriveCredential.findByIdAndDelete(req.params.id);
//     res.json({ message: "Credential deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
