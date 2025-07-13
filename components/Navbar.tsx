"use client";

import { Button } from "@/components/ui/button";
import { UserButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, Sun, Moon, Laptop } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { AiFillStar } from "react-icons/ai";
import { BiCoffee } from "react-icons/bi";

const Navbar = () => {
  const [pendingGeminiVersion, setPendingGeminiVersion] = useState("gemini-2.5-flash");
  const [pendingGeminiKey, setPendingGeminiKey] = useState("");
  const { preferredLanguage, setPreferredLanguage } = useLanguage();
  const [pendingLanguage, setPendingLanguage] = useState(preferredLanguage);
  const { setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini-key") || "";
    setPendingGeminiKey(savedKey);

    const savedVersion = localStorage.getItem("gemini-version") || "gemini-2.5-flash";
    setPendingGeminiVersion(savedVersion);

    setPendingLanguage(preferredLanguage);
  }, [preferredLanguage]);

  const handleSaveSettings = () => {
    localStorage.setItem("gemini-key", pendingGeminiKey);
    localStorage.setItem("preferred-language", pendingLanguage);
    localStorage.setItem("gemini-version", pendingGeminiVersion);

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleStarProject = () => {
    window.open("https://github.com/ayush-that/codejeet", "_blank");
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="font-bold text-2xl flex-1">
          <Link href="/" className="flex items-center">
            <span className="inline drop-shadow-lg font-poppins">CodeJeet 🏆</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => window.open("https://www.buymeacoffee.com/shydev69", "_blank")}
            className="hidden sm:flex bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
            size="icon"
          >
            <BiCoffee className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            onClick={handleStarProject}
            className="hidden sm:flex bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <AiFillStar className="mr-1" />
            Star this project
          </Button>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-16 mt-2 w-80 bg-card border-border shadow-lg">
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gemini API Key</label>
                    <Input
                      type="password"
                      value={pendingGeminiKey}
                      onChange={(e) => setPendingGeminiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Language</label>
                    <Select value={pendingLanguage} onValueChange={setPendingLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gemini Version</label>
                    <Select value={pendingGeminiVersion} onValueChange={setPendingGeminiVersion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gemini Version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                        <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
                        <SelectItem value="gemini-2.5-flash-lite-preview-06-17">
                          Gemini 2.5 Flash Lite Preview 06-17
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <div className="flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4 mr-1" /> Light
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4 mr-1" /> Dark
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setTheme("system")}
                      >
                        <Laptop className="h-4 w-4 mr-1" /> System
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleSaveSettings}>
                    Save Settings
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
