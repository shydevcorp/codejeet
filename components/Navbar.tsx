"use client";

import { Button } from "@/components/ui/button";
import { UserButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Github } from "lucide-react";

const Navbar = () => {
  const handleStarProject = () => {
    window.open("https://github.com/shydevcorp/codejeet", "_blank");
  };

  return (
    <div className="border-b sticky top-0 z-50 bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="font-bold text-2xl flex-1">
          <Link href="/" className="flex items-center">
            <span className="inline drop-shadow-lg font-poppins">CodeJeet</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleStarProject}
            className="hidden sm:flex bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="h-4 w-4 mr-1" /> Star Project
          </Button>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
