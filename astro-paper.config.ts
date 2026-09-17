import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://redsunjapan.com/",
    title: "Red Sun Japan",
    description: "Chronicles of Feudal Japan, Samurai Legends, and Dark Folklore.",
    desc: "Chronicles of Feudal Japan, Samurai Legends, and Dark Folklore.",
    author: "Red Sun Japan",
    profile: "https://www.youtube.com/@redsunjapan",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Tokyo",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    {
      name: "youtube",
      url: "https://www.youtube.com/@redsunjapan",
      linkTitle: "Red Sun Japan on YouTube",
    },
    {
      name: "rss",
      url: "/rss.xml",
      linkTitle: "RSS Feed",
    },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});