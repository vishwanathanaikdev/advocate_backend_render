// routes/driveCredential.router.js
const express = require("express");
const router = express.Router();
const {
  createCredential,
  getAllCredentials,
  getCredentialById,
  updateCredential,
  deleteCredential,
} = require("../controllers/driveCredential.controller");

router.post("/", createCredential);
router.get("/", getAllCredentials);
router.get("/:id", getCredentialById);
router.put("/:id", updateCredential);
router.delete("/:id", deleteCredential);

module.exports = router;  // ✅ this must export the router
