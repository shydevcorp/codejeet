// Navbar.tsx
"use client";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"; // Adjust the import path as needed
import { ModeToggle } from "./mode-toggle";
import { UserButton } from "@clerk/clerk-react"; // Import UserButton

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex flex-col md:flex-row h-16 items-center px-4 container mx-auto justify-between">
        {/* Left Section */}
        <div className="font-bold text-2xl font-['Poppins'] flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className="flex items-center">
                  <span className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
                    takeubackward
                  </span>
                  <span className="inline-block rotate-180 ml-2">🚀</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        {/* Right Section */}
        <div className="font-['Inter'] flex items-center space-x-4 mt-2 md:mt-0">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/dashboard" className="text-base">
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ModeToggle />
          <UserButton /> {/* Add UserButton for logout */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
