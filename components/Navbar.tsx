import { ModeToggle } from "./mode-toggle";
import { BsRocketFill } from "react-icons/bs";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="font-bold text-2xl font-['Poppins'] flex items-baseline">
          <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-transparent bg-clip-text">
            takeubackward
          </span>{" "}
          <span className="inline-block rotate-180">
            <BsRocketFill />
          </span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
