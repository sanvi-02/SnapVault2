// controllers/tag.controller.js — Tag Discovery
import Tag from "../models/Tag.js";
import Media from "../models/Media.js";

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tags?page=1&limit=30&q=...
// List all tags sorted by media count (trending first), with optional search
// ─────────────────────────────────────────────────────────────────────────────
export const getAllTags = async (req, res) => {
  try {
    const { page = 1, limit = 30, q = "" } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (q.trim()) {
      filter.name = new RegExp(
        q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
    }

    const [tags, total] = await Promise.all([
      Tag.find(filter)
        .sort({ mediaCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Tag.countDocuments(filter),
    ]);

    // Also return trending tags (top 20)
    const trending = await Tag.find({ mediaCount: { $gt: 0 } })
      .sort({ mediaCount: -1 })
      .limit(20);

    return res.json({
      tags,
      trending,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("getAllTags error:", err);
    res.status(500).json({ message: "Failed to fetch tags" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/tags/:slug
// Tag detail page — returns tag info + media that have this tag
// ─────────────────────────────────────────────────────────────────────────────
export const getTagBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Find the tag document
    const tag = await Tag.findOne({ slug: slug.toLowerCase() });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Find media that have this tag (either in manual tags or AI tags)
    const tagRegex = new RegExp(`^${tag.name}$`, "i");
    const mediaFilter = {
      $or: [{ tags: tagRegex }, { "aiTags.label": tagRegex }],
    };

    const [media, total] = await Promise.all([
      Media.find(mediaFilter)
        .populate("uploadedBy", "name email")
        .populate("eventId", "name date")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Media.countDocuments(mediaFilter),
    ]);

    // Find related tags (other tags that appear on the same media)
    const mediaIds = media.map((m) => m._id);
    const relatedMediaDocs = await Media.find({
      _id: { $in: mediaIds },
    }).select("tags aiTags");

    const relatedTagNames = new Set();
    relatedMediaDocs.forEach((m) => {
      m.tags.forEach((t) => relatedTagNames.add(t.toLowerCase()));
      m.aiTags.forEach((t) => relatedTagNames.add(t.label.toLowerCase()));
    });
    relatedTagNames.delete(tag.name); // remove self

    const relatedTags = await Tag.find({
      name: { $in: Array.from(relatedTagNames) },
    })
      .sort({ mediaCount: -1 })
      .limit(15);

    return res.json({
      tag,
      media,
      relatedTags,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("getTagBySlug error:", err);
    res.status(500).json({ message: "Failed to fetch tag detail" });
  }
};
