"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Link from "next/link";
import { Menu } from "lucide-react"; // Import the hamburger icon
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        {/* Left Section */}
        <div className="font-bold text-2xl flex items-center">
          <Link href="/" className="flex items-center">
            <span className="inline bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
              takeubackward
            </span>
            <span className="inline-block rotate-180 ml-2">🚀</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <SignedOut>
            <Button variant="outline" asChild>
              <Link href="/dashboard" className="text-base">
                Log In
              </Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden p-4 space-y-4 flex flex-col items-center">
            <SignedOut>
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard" className="text-base">
                  Log In
                </Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
