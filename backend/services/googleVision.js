// services/googleVision.js — Google Cloud Vision API integration
// ─────────────────────────────────────────────────────────────────────────────
// Calls the Google Cloud Vision API to extract labels from images.
// If no credentials are configured, degrades gracefully (returns []).
// ─────────────────────────────────────────────────────────────────────────────

const VISION_API_ENDPOINT = "https://vision.googleapis.com/v1/images:annotate";
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;
const MIN_CONFIDENCE = 0.70;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isVisionConfigured() {
  return !!(
    process.env.GOOGLE_VISION_API_KEY ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  );
}

async function imageUrlToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${imageUrl}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64");
}

export async function analyzeImage(imageUrl) {
  if (!isVisionConfigured()) {
    console.warn(
      "⚠️  Google Vision API not configured — skipping AI tagging. " +
        "Set GOOGLE_VISION_API_KEY in .env to enable."
    );
    return [];
  }

  const apiKey = process.env.GOOGLE_VISION_API_KEY;
  const base64Image = await imageUrlToBase64(imageUrl);

  const requestBody = {
    requests: [
      {
        image: { content: base64Image },
        features: [{ type: "LABEL_DETECTION", maxResults: 20 }],
      },
    ],
  };

  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const url = `${VISION_API_ENDPOINT}?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Vision API HTTP ${response.status}: ${errorBody.slice(0, 300)}`
        );
      }

      const data = await response.json();
      const annotations = data.responses?.[0]?.labelAnnotations || [];

      return annotations
        .filter((a) => a.score >= MIN_CONFIDENCE)
        .map((a) => ({
          label: a.description.toLowerCase().trim(),
          confidence: Math.round(a.score * 1000) / 1000,
        }));
    } catch (err) {
      lastError = err;
      console.error(
        `❌ Vision API attempt ${attempt}/${MAX_RETRIES} failed:`,
        err.message
      );
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1));
      }
    }
  }

  console.error("❌ Google Vision API failed after all retries:", lastError?.message);
  return [];
}
