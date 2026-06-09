// routes/tag.routes.js
import express from "express";
import { getAllTags, getTagBySlug } from "../controllers/tag.controller.js";

const router = express.Router();

// Public routes — no auth required for browsing tags
router.get("/", getAllTags);
router.get("/:slug", getTagBySlug);

export default router;
