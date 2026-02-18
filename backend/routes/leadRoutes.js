const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// CREATE lead
router.post("/", async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all leads
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE lead
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/test", (req, res) => {
  res.send("Delete route working");
});

// DELETE lead
router.delete("/:id", async (req, res) => {
  try {
    const deletedLead = await Lead.findByIdAndDelete(req.params.id);

    if (!deletedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
