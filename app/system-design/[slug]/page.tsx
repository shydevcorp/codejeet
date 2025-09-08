import fs from "fs/promises";
import path from "path";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import Slugger from "github-slugger";
import TOC, { TocItem } from "@/components/TOC";
import { cn } from "@/lib/utils";
import matter from "gray-matter";

export const dynamic = "error";
export const dynamicParams = false;

const CONTENT_ROOT = path.join(process.cwd(), "public", "system-design");

async function readMarkdownAndFolderBySlug(slug: string): Promise<{
  content: string;
  folder: string;
  video?: string | null;
  podcast?: string | null;
} | null> {
  try {
    const dirents = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    const folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
    for (const folder of folders) {
      try {
        const dirPath = path.join(CONTENT_ROOT, folder);
        const files = await fs.readdir(dirPath);
        const mdFile = files.find((f) => f.toLowerCase().endsWith(".md"));
        if (!mdFile) continue;
        const raw = await fs.readFile(path.join(dirPath, mdFile), "utf8");
        const parsed = matter(raw);
        const fmSlug = (parsed.data?.slug as string | undefined)?.trim();
        if (!fmSlug) continue;
        if (fmSlug === slug) {
          const video = (parsed.data?.video as string | undefined)?.trim() || null;
          const podcast = (parsed.data?.podcast as string | undefined)?.trim() || null;
          return { content: parsed.content, folder, video, podcast };
        }
      } catch {
        continue;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const dirents = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    const folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
    const slugs: { slug: string }[] = [];
    for (const folder of folders) {
      try {
        const dirPath = path.join(CONTENT_ROOT, folder);
        const files = await fs.readdir(dirPath);
        const mdFile = files.find((f) => f.toLowerCase().endsWith(".md"));
        if (!mdFile) continue;
        const raw = await fs.readFile(path.join(dirPath, mdFile), "utf8");
        const parsed = matter(raw);
        const fmSlug = (parsed.data?.slug as string | undefined)?.trim();
        if (fmSlug) slugs.push({ slug: fmSlug });
      } catch {
        continue;
      }
    }
    return slugs;
  } catch {
    return [] as Array<{ slug: string }>;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const dirents = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
    const folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
    for (const folder of folders) {
      try {
        const dirPath = path.join(CONTENT_ROOT, folder);
        const files = await fs.readdir(dirPath);
        const mdFile = files.find((f) => f.toLowerCase().endsWith(".md"));
        if (!mdFile) continue;
        const raw = await fs.readFile(path.join(dirPath, mdFile), "utf8");
        const parsed = matter(raw);
        const fmSlug = (parsed.data?.slug as string | undefined)?.trim();
        if (fmSlug === slug) {
          const fmTitle = (parsed.data?.title as string | undefined)?.trim();
          let title = fmTitle || "System Design";
          if (!fmTitle) {
            const h1 = parsed.content.match(/^#\s+(.+)$/m) || parsed.content.match(/^##\s+(.+)$/m);
            if (h1?.[1]) title = h1[1].trim();
          }
          return { title };
        }
      } catch {
        continue;
      }
    }
  } catch {}
  return { title: "System Design" };
}

export default async function SystemDesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  const slug = decodeURIComponent(resolved.slug);
  const result = await readMarkdownAndFolderBySlug(slug);
  if (!result) return notFound();
  const { content, folder, video, podcast } = result;

  function toYouTubeEmbed(url: string): string | null {
    try {
      const trimmed = url.trim();
      if (!trimmed) return null;
      let m = trimmed.match(/^https?:\/\/youtu\.be\/([\w-]{6,})/i);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
      m = trimmed.match(/[?&]v=([\w-]{6,})/i);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
      m = trimmed.match(/youtube\.com\/shorts\/([\w-]{6,})/i);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
      return null;
    } catch {
      return null;
    }
  }
  const embedUrl = video ? toYouTubeEmbed(video) : null;
  function toSpotifyEmbed(url: string): string | null {
    try {
      const trimmed = url.trim();
      if (!trimmed) return null;
      const m = trimmed.match(/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/i);
      if (m) return `https://open.spotify.com/embed/episode/${m[1]}?theme=0`;
      return null;
    } catch {
      return null;
    }
  }
  const podcastEmbed = podcast ? toSpotifyEmbed(podcast) : null;

  const slugger = new Slugger();
  const toc: TocItem[] = [];
  for (const line of content.split("\n")) {
    const m = /^(#{1,4})\s+(.+)$/.exec(line.trim());
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/[#`*_]+/g, "").trim();
      const id = slugger.slug(text);
      toc.push({ id, text, depth });
    }
  }

  interface ChapterItem {
    slug: string;
    title: string;
  }
  async function getChapters(): Promise<ChapterItem[]> {
    try {
      const dirents = await fs.readdir(CONTENT_ROOT, { withFileTypes: true });
      const folders = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
      const items: Array<ChapterItem & { order: number }> = [];
      for (const folder of folders) {
        const files = await fs.readdir(path.join(CONTENT_ROOT, folder));
        const md = files.find((f) => f.toLowerCase().endsWith(".md"));
        if (!md) continue;
        try {
          const mdContent = await fs.readFile(path.join(CONTENT_ROOT, folder, md), "utf8");
          const parsed = matter(mdContent);
          const fmSlug = (parsed.data?.slug as string | undefined)?.trim();
          if (!fmSlug) continue;
          let title = folder.replace(/[-_]+/g, " ");
          const h1 = parsed.content.match(/^#\s+(.+)$/m) || parsed.content.match(/^##\s+(.+)$/m);
          if (h1?.[1]) title = h1[1].trim();
          const folderOrderMatch = folder.match(/^(\d{1,3})/);
          const titleOrderMatch = title.match(/chapter\s*(\d{1,3})/i);
          const orderFromFolder = folderOrderMatch ? parseInt(folderOrderMatch[1], 10) : NaN;
          const orderFromTitle = titleOrderMatch ? parseInt(titleOrderMatch[1], 10) : NaN;
          const order = Number.isFinite(orderFromFolder)
            ? orderFromFolder
            : Number.isFinite(orderFromTitle)
              ? orderFromTitle
              : Number.MAX_SAFE_INTEGER;
          items.push({ slug: fmSlug, title, order });
        } catch {}
      }
      items.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
      });
      return items.map(({ slug, title }) => ({ slug, title }));
    } catch {
      return [];
    }
  }
  const chapters = await getChapters();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile controls on top, stacked */}
      <div className="md:hidden mb-4 space-y-2">
        <details className="w-full border rounded-lg">
          <summary className="cursor-pointer px-3 py-2">Chapters</summary>
          <div className="p-3">
            <nav aria-label="Chapters" className="text-sm">
              <ul className="space-y-1">
                {chapters.map((c) => (
                  <li key={c.slug} className="leading-6">
                    <Link
                      href={`/system-design/${encodeURIComponent(c.slug)}`}
                      className={cn(
                        "hover:underline",
                        c.slug === slug ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </details>
        <details className="w-full border rounded-lg">
          <summary className="cursor-pointer px-3 py-2">On this page</summary>
          <div className="p-3">
            <TOC items={toc} />
          </div>
        </details>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="hidden md:block col-span-3">
          <TOC items={toc} />
        </aside>
        <div className="col-span-12 md:col-span-6 mx-auto max-w-3xl order-last md:order-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              rehypeHighlight,
            ]}
            className="prose dark:prose-invert max-w-none prose-headings:mt-6 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-pre:my-3 prose-table:my-4"
            components={{
              h1: ({ children }) => (
                <div>
                  <h1>{children}</h1>
                  {embedUrl && (
                    <div className="my-4">
                      <div
                        className="w-full rounded-lg overflow-hidden border"
                        style={{ aspectRatio: "16 / 9" }}
                      >
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                  {podcastEmbed && (
                    <div className="my-4">
                      <iframe
                        src={podcastEmbed}
                        className="w-full rounded-xl border"
                        height={152}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              ),
              iframe: undefined,
              img: (props) => {
                const rawSrc = (props.src ?? "").toString();
                const isAbsolute = /^([a-z]+:)?\/\//i.test(rawSrc) || rawSrc.startsWith("/");
                const normalized = rawSrc.replace(/^\.\/?/, "");
                const finalSrc = isAbsolute
                  ? rawSrc
                  : `/system-design/${encodeURIComponent(folder)}/${normalized}`;
                return (
                  <img
                    {...props}
                    src={finalSrc}
                    alt={props.alt ?? ""}
                    className="rounded-lg border my-4"
                  />
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <aside className="hidden md:block col-span-3">
          <nav
            aria-label="Chapters"
            className="text-sm sticky top-20 max-h-[80vh] overflow-auto pl-2"
          >
            <div className="font-medium mb-2 text-muted-foreground">Chapters</div>
            <ul className="space-y-1">
              {chapters.map((c) => (
                <li key={c.slug} className="leading-6">
                  <Link
                    href={`/system-design/${encodeURIComponent(c.slug)}`}
                    className={cn(
                      "hover:underline",
                      c.slug === slug ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
