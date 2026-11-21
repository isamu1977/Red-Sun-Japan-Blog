#!/usr/bin/env node
/**
 * Checks only blog posts marked `draft: true` that have a `youtube_video_id`
 * in frontmatter. Batch-queries YouTube Data API v3 (`videos?part=status,snippet`, up to 50 IDs/request).
 * Whenever a video's `privacyStatus === "public"`:
 *   1. Flips `draft: true` -> `draft: false`
 *   2. Syncs `pubDatetime` to the exact JST (+09:00) date/time the video became public on YouTube.
 */
import fs from "node:fs";
import path from "node:path";

const BLOG_DIR = path.resolve(process.cwd(), "src/content/blog");
const API_KEY = (process.env.YOUTUBE_API_KEY || "").trim();

if (!API_KEY) {
  console.error("Missing YOUTUBE_API_KEY environment variable.");
  process.exit(1);
}

function toJstIso(utcIso) {
  if (!utcIso) return null;
  const dt = new Date(utcIso);
  if (Number.isNaN(dt.getTime())) return null;
  // Convert UTC timestamp to JST (+09:00)
  const jstMs = dt.getTime() + 9 * 60 * 60 * 1000;
  const jstDate = new Date(jstMs);
  return jstDate.toISOString().replace(/\.\d{3}Z$/, "+09:00");
}

const files = fs
  .readdirSync(BLOG_DIR)
  .filter((name) => name.endsWith(".md") && !name.startsWith("_"));

const pendingDrafts = [];

for (const file of files) {
  const fullPath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(fullPath, "utf8");
  const fmMatch = content.match(/^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n?)/);
  if (!fmMatch) continue;

  const frontmatter = fmMatch[2];
  const isDraft = /^draft:\s*true\s*$/m.test(frontmatter);
  if (!isDraft) continue;

  const vidMatch = frontmatter.match(/^youtube_video_id:\s*["']?([A-Za-z0-9_-]{6,})["']?\s*$/m);
  if (!vidMatch) continue;

  pendingDrafts.push({
    file,
    fullPath,
    content,
    videoId: vidMatch[1],
  });
}

console.log(`Found ${pendingDrafts.length} draft post(s) with youtube_video_id.`);
if (pendingDrafts.length === 0) {
  process.exit(0);
}

const publicVideoInfo = new Map();
for (let i = 0; i < pendingDrafts.length; i += 50) {
  const batch = pendingDrafts.slice(i, i + 50);
  const idsParam = batch.map((item) => item.videoId).join(",");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=status,snippet&id=${encodeURIComponent(idsParam)}&key=${encodeURIComponent(API_KEY)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    console.error(`YouTube API error (${res.status}): ${body}`);
    process.exit(1);
  }

  const data = await res.json();
  for (const item of data.items || []) {
    if (item?.status?.privacyStatus === "public" && item?.id) {
      publicVideoInfo.set(item.id, {
        publishedAtJst: toJstIso(item?.snippet?.publishedAt),
      });
    }
  }
}

let publishedCount = 0;
for (const entry of pendingDrafts) {
  const info = publicVideoInfo.get(entry.videoId);
  if (!info) {
    console.log(`  [KEEP DRAFT] ${entry.file} (video=${entry.videoId})`);
    continue;
  }

  let updated = entry.content.replace(/^draft:\s*true\s*$/m, "draft: false");
  if (info.publishedAtJst) {
    if (/^pubDatetime:\s*.*$/m.test(updated)) {
      updated = updated.replace(
        /^pubDatetime:\s*.*$/m,
        `pubDatetime: ${info.publishedAtJst}`
      );
    } else {
      updated = updated.replace(
        /^(---\r?\n)/,
        `$1pubDatetime: ${info.publishedAtJst}\n`
      );
    }
  }

  if (updated !== entry.content) {
    fs.writeFileSync(entry.fullPath, updated, "utf8");
    publishedCount += 1;
    console.log(
      `  [PUBLISHED]  ${entry.file} (video=${entry.videoId}, pubDatetime=${info.publishedAtJst || "unchanged"})`
    );
  }
}

console.log(`Done: ${publishedCount} post(s) flipped from draft: true to draft: false.`);
