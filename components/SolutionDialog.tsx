"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Book } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown, { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useLanguage } from "@/contexts/LanguageContext";

interface SolutionDialogProps {
  questionId: string;
  title: string;
}

interface SolutionData {
  hints: string[];
  solution: string;
}

export function SolutionDialog({ questionId, title }: SolutionDialogProps) {
  const [solutionData, setSolutionData] = React.useState<SolutionData>({ hints: [], solution: "" });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { preferredLanguage } = useLanguage();

  const fetchSolution = async () => {
    setLoading(true);
    setError(null);

    try {
      const geminiKey = localStorage.getItem("gemini-key");
      const headers: HeadersInit = {};
      if (geminiKey) {
        headers["x-gemini-key"] = geminiKey;
      }

      const response = await fetch(
        `/api/solutions?id=${questionId}&language=${preferredLanguage}`,
        { headers }
      );
      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Unexpected response format. The server did not return valid JSON."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setSolutionData(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load solution";
      console.error("Error fetching solution:", error);
      setError(message);
      setSolutionData({ hints: [], solution: "" });
    } finally {
      setLoading(false);
    }
  };

  const renderers: Components = {
    code: ({
      inline,
      className,
      children,
      ...props
    }: {
      inline?: boolean;
      className?: string;
      children?: React.ReactNode;
    }) => {
      const match = /language-(\w+)/.exec(className || "");
      return inline ? (
        <code className={className} {...props}>
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          style={nightOwl}
          language={match ? match[1] : "plaintext"}
          PreTag="div"
          showLineNumbers={true}
          wrapLongLines={true}
          customStyle={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: "1em 0",
          }}
          lineNumberStyle={{
            minWidth: "3em",
            paddingRight: "1em",
            textAlign: "right",
            userSelect: "none",
          }}
          {...props}
        >
          {String(children).trim()}
        </SyntaxHighlighter>
      );
    },
    h1: ({ children }) => <h1 className="font-bold text-xl">{children}</h1>,
    h2: ({ children }) => <h2 className="font-bold text-lg">{children}</h2>,
    p: ({ children }) => <p className="mb-2">{children}</p>,
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Book
          className="h-4 w-4 cursor-pointer"
          onClick={() => fetchSolution()}
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {loading && <Skeleton className="h-20 w-full" />}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && (
            (solutionData?.hints?.length > 0 || solutionData?.solution) && (
              <div className="space-y-4">
                {solutionData.hints?.length > 0 && (
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Hints:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {solutionData.hints.map((hint, index) => (
                        <li key={index}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {solutionData.solution && (
                  <ReactMarkdown components={renderers} className="prose dark:prose-invert">
                    {solutionData.solution}
                  </ReactMarkdown>
                )}
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
