/**
 * Estimates reading time from raw Markdown / text content.
 * Assumes average reading speed of 200 words per minute.
 */
export function getReadingTime(content?: string): string {
  if (!content) return "3 min read";

  const clean = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[#*`_~[\]()\-]/g, " ");

  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return `${minutes} min read`;
}
