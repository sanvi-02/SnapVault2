// services/tagging.service.js — AI Tag Processing Pipeline
import Media from "../models/Media.js";
import Tag from "../models/Tag.js";
import { analyzeImage, isVisionConfigured } from "./googleVision.js";

export async function processMediaTags(mediaId, imageUrl) {
  try {
    if (!isVisionConfigured()) {
      await Media.findByIdAndUpdate(mediaId, {
        aiTags: [],
        aiTagsProcessed: true,
      });
      return;
    }

    const labels = await analyzeImage(imageUrl);

    if (labels.length === 0) {
      await Media.findByIdAndUpdate(mediaId, {
        aiTags: [],
        aiTagsProcessed: true,
      });
      console.log(`ℹ️  No AI tags for media ${mediaId}`);
      return;
    }

    const tagPromises = labels.map((l) => Tag.upsertTag(l.label, "ai"));
    await Promise.allSettled(tagPromises);

    await Media.findByIdAndUpdate(mediaId, {
      aiTags: labels,
      aiTagsProcessed: true,
    });

    console.log(
      `✅ AI tags for media ${mediaId}: ${labels.length} — [${labels.map((l) => l.label).join(", ")}]`
    );
  } catch (err) {
    await Media.findByIdAndUpdate(mediaId, {
      aiTags: [],
      aiTagsProcessed: true,
    }).catch(() => {});
    console.error(`❌ AI tagging failed for media ${mediaId}:`, err.message);
  }
}

export async function syncManualTags(tagNames) {
  if (!tagNames || tagNames.length === 0) return;
  try {
    await Promise.allSettled(
      tagNames.map((name) => Tag.upsertTag(name, "manual"))
    );
  } catch (err) {
    console.error("❌ Manual tag sync failed:", err.message);
  }
}
