"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { UserButton } from "@clerk/clerk-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex flex-col md:flex-row h-16 items-center px-4 container mx-auto justify-between">
        {/* Left Section */}
        <div className="font-bold text-2xl flex items-center">
          <Link href="/" className="flex items-center">
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
              takeubackward
            </span>
            <span className="inline-block rotate-180 ml-2">🚀</span>
          </Link>
        </div>
        {/* Right Section */}
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <Button variant="outline" asChild>
            <Link href="/dashboard" className="text-base">
              Dashboard
            </Link>
          </Button>
          <ModeToggle />
          <Button variant="outline" size="icon">
            <UserButton afterSignOutUrl="/" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
