"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}

export default function TOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const handler = () => {
      const headings = items
        .map((i) => document.getElementById(i.id))
        .filter(Boolean) as HTMLElement[];
      let current = headings[0]?.id || "";
      for (const h of headings) {
        const top = h.getBoundingClientRect().top;
        if (top <= 100) current = h.id;
        else break;
      }
      setActiveId(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="text-sm sticky top-20 max-h-[80vh] overflow-auto pr-4"
    >
      <div className="font-medium mb-2 text-muted-foreground">On this page</div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn("leading-6", item.depth > 2 && "pl-4", item.depth > 3 && "pl-8")}
          >
            <Link
              href={`#${item.id}`}
              className={cn(
                "hover:underline",
                activeId === item.id ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
