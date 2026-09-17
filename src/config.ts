/**
 * Internal resolved configuration used throughout the codebase.
 *
 * Prefer editing `astro-paper.config.ts` instead of this file. This module exists to
 * apply defaults and expose a fully-resolved config shape (`ResolvedAstroPaperConfig`).
 */
import userConfig from "@/astro-paper.config";
import type { ResolvedAstroPaperConfig } from "./types/config";
import { PUBLIC_GOOGLE_SITE_VERIFICATION } from "astro:env/client";

const DEFAULT_OG_IMAGE = "default-og.jpg";

export const SITE = {
  ...userConfig.site,
  title: "Red Sun Japan",
  author: "Red Sun Japan",
  profile: "https://www.youtube.com/@redsunjapan",
  desc: "Chronicles of Feudal Japan, Samurai Legends, and Dark Folklore.",
  description: "Chronicles of Feudal Japan, Samurai Legends, and Dark Folklore.",
  ogImage: userConfig.site.ogImage ?? DEFAULT_OG_IMAGE,
  lang: userConfig.site.lang ?? "en",
  timezone: userConfig.site.timezone ?? "Asia/Tokyo",
  dir: userConfig.site.dir ?? "ltr",
  googleVerification:
    userConfig.site.googleVerification || PUBLIC_GOOGLE_SITE_VERIFICATION,
};

const config: ResolvedAstroPaperConfig = {
  site: SITE,
  posts: {
    perPage: userConfig.posts?.perPage ?? 4,
    perIndex: userConfig.posts?.perIndex ?? 4,
    scheduledPostMargin:
      userConfig.posts?.scheduledPostMargin ?? 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: userConfig.features?.lightAndDarkMode ?? true,
    dynamicOgImage: userConfig.features?.dynamicOgImage ?? true,
    showArchives: userConfig.features?.showArchives ?? true,
    showBackButton: userConfig.features?.showBackButton ?? true,
    editPost: userConfig.features?.editPost ?? { enabled: false },
    search: userConfig.features?.search ?? "pagefind",
  },
  socials: userConfig.socials ?? [],
  shareLinks: userConfig.shareLinks ?? [],
};

export const SOCIALS = config.socials;

export default config;
