const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ZOOM_API_KEY = "YOUR_ZOOM_API_KEY";
const ZOOM_API_SECRET = "YOUR_ZOOM_API_SECRET";
const ZOOM_BASE_URL = "https://api.zoom.us/v2";

const zoomAuthHeaders = {
  Authorization: `Bearer ${generateZoomJWT()}`,
  "Content-Type": "application/json",
};

function generateZoomJWT() {
  const jwt = require("jsonwebtoken");
  const payload = {
    iss: ZOOM_API_KEY,
    exp: new Date().getTime() + 5000,
  };
  return jwt.sign(payload, ZOOM_API_SECRET);
}

app.post("/check-participants", async (req, res) => {
  try {
    const { meetingId, expectedParticipants } = req.body;

    if (
      !meetingId ||
      !expectedParticipants ||
      !Array.isArray(expectedParticipants)
    ) {
      return res
        .status(400)
        .json({ error: "Missing meetingId or expectedParticipants array" });
    }

    const participantsResponse = await axios.get(
      `${ZOOM_BASE_URL}/metrics/meetings/${meetingId}/participants`,
      { headers: zoomAuthHeaders }
    );

    const currentParticipants = participantsResponse.data.participants.map(
      (p) => p.name.toLowerCase().trim()
    );

    const missingParticipants = expectedParticipants
      .map((name) => name.toLowerCase().trim())
      .filter((name) => !currentParticipants.includes(name));

    const allPresent = missingParticipants.length === 0;

    res.json({
      allPresent,
      missingParticipants,
      currentParticipantsCount: currentParticipants.length,
      expectedParticipantsCount: expectedParticipants.length,
    });
  } catch (error) {
    console.error(
      "Error checking participants:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to check participants",
      details: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
