"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tweet } from "react-tweet";
import { cn } from "@/lib/utils";

const tweetGridVariants = cva("max-w-4xl md:max-w-6xl px-2", {
  variants: {
    columns: {
      1: "grid auto-rows-auto grid-cols-1",
      2: "grid auto-rows-auto grid-cols-1 sm:grid-cols-2",
      3: "grid auto-rows-auto grid-cols-1 md:grid-cols-3",
      4: "grid auto-rows-auto grid-cols-1 lg:grid-cols-4",
      5: "grid auto-rows-auto grid-cols-1 xl:grid-cols-5",
    },
  },
  defaultVariants: {
    columns: 3,
  },
});

const tweetItemVariants = cva("", {
  variants: {
    spacing: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

export interface TweetGridProps
  extends VariantProps<typeof tweetGridVariants>,
    VariantProps<typeof tweetItemVariants> {
  tweets: string[];
  spacing?: "sm" | "md" | "lg";
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export const TweetGrid: React.FC<TweetGridProps> = ({ tweets, columns, spacing, className }) => {
  // Calculate the number of rows needed based on total tweets and columns
  const numColumns = columns === 3 ? 3 : columns || 3;
  const rows = Math.ceil(tweets.length / numColumns);

  // Reorganize tweets into columns
  const columns_array = Array.from({ length: numColumns }, (_, colIndex) =>
    tweets.filter((_, index) => index % numColumns === colIndex)
  );

  return (
    <div className={cn(tweetGridVariants({ columns }), "gap-x-8", className)}>
      {columns_array.map((columnTweets, colIndex) => (
        <div key={colIndex} className="flex flex-col [&>*:not(:first-child)]:mt-[-24px]">
          {columnTweets.map((tweetId) => (
            <div key={tweetId}>
              <Tweet id={tweetId} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
