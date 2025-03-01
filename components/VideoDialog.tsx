"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Youtube } from "lucide-react";
import { videoMappings } from "@/mappings/videoMappings";

interface VideoDialogProps {
  id: string;
  title: string;
}

export function VideoDialog({ id, title }: VideoDialogProps) {
  const [open, setOpen] = React.useState(false);

  const getVideoUrl = (problemId: string) => {
    return videoMappings[problemId] || "dQw4w9WgXcQ";
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Youtube className="h-4 w-4 text-red-600" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{title} - Video Solution</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${getVideoUrl(id)}`}
              title={`${title} - Video Solution`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
