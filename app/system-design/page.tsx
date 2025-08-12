import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { redirect } from "next/navigation";

const CONTENT_ROOT = path.join(process.cwd(), "public", "system-design");

export default async function SystemDesignIndexRedirect() {
  const dirents = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
  const folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name);

  const items: Array<{ slug: string; order: number; title: string }> = [];
  for (const folder of folders) {
    try {
      const files = await fs.readdir(path.join(CONTENT_ROOT, folder));
      const mdFile = files.find((f) => f.toLowerCase().endsWith(".md"));
      if (!mdFile) continue;
      const raw = await fs.readFile(path.join(CONTENT_ROOT, folder, mdFile), "utf8");
      const parsed = matter(raw);
      const fmSlug = (parsed.data?.slug as string | undefined)?.trim();
      if (!fmSlug) continue;
      let title = (parsed.data?.title as string | undefined)?.trim() || folder;
      const h1 = parsed.content.match(/^#\s+(.+)$/m) || parsed.content.match(/^##\s+(.+)$/m);
      if (!parsed.data?.title && h1?.[1]) title = h1[1].trim();

      const folderOrderMatch = folder.match(/^(\d{1,3})/);
      const titleOrderMatch = title.match(/chapter\s*(\d{1,3})/i);
      const orderFromFolder = folderOrderMatch ? parseInt(folderOrderMatch[1], 10) : NaN;
      const orderFromTitle = titleOrderMatch ? parseInt(titleOrderMatch[1], 10) : NaN;
      const order = Number.isFinite(orderFromFolder)
        ? orderFromFolder
        : Number.isFinite(orderFromTitle)
          ? orderFromTitle
          : Number.MAX_SAFE_INTEGER;

      items.push({ slug: fmSlug, order, title });
    } catch {
      continue;
    }
  }

  if (items.length === 0) {
    redirect("/");
  }

  items.sort((a, b) => (a.order !== b.order ? a.order - b.order : a.title.localeCompare(b.title)));
  redirect(`/system-design/${encodeURIComponent(items[0].slug)}`);
}
