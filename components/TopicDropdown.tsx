import React, { useState, useEffect, useRef } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { GrPowerReset } from "react-icons/gr";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicDropdownProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

const TopicDropdown: React.FC<TopicDropdownProps> = ({
  options,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTopicClick = (topic: string) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(topic)) {
        return prevSelected.filter((item) => item !== topic);
      } else {
        return [...prevSelected, topic];
      }
    });
  };

  const handleReset = () => {
    setSelectedOptions([]);
  };

  const visibleTopics = isExpanded ? options : options.slice(0, 5);

  return (
    <div className="flex-1 relative" ref={dropdownRef}>
      <div
        className={cn(
          "flex justify-between items-center cursor-pointer border border-input bg-transparent rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring",
          "bg-transparent text-sm"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOptions.length > 0 ? selectedOptions.join(", ") : "Topics"}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>

      {isOpen && (
        <div
          className={cn(
            "mt-2 bg-white border border-input rounded-md shadow-lg p-2 space-y-2 absolute z-10 w-full md:w-[calc(97%+1rem)]",
            "bg-popover text-popover-foreground"
          )}
        >
          <SimpleBar style={{ maxHeight: "200px" }}>
            <div className="flex flex-wrap gap-2 p-2">
              {visibleTopics.map((option) => (
                <div
                  key={option}
                  onClick={() => handleTopicClick(option)}
                  className={cn(
                    "cursor-pointer text-xs px-4 py-2 rounded-md border border-input",
                    selectedOptions.includes(option)
                      ? "bg-blue-500 text-white"
                      : "focus:text-accent-foreground",
                    "hover:bg-blue-400 hover:text-white"
                  )}
                >
                  {option}
                </div>
              ))}
            </div>
          </SimpleBar>

          <div className="flex justify-between mt-2">
            <button
              onClick={handleReset}
              disabled={selectedOptions.length === 0}
              className={cn(
                "px-4 py-2 rounded-md flex items-center transition ease-in-out duration-150",
                selectedOptions.length === 0
                  ? "text-muted-foreground cursor-not-allowed"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <GrPowerReset className="mr-2" />
              Reset
            </button>

            {options.length > 5 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition ease-in-out duration-150"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicDropdown;