import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="font-bold text-2xl font-['Poppins'] flex items-center">
          <span className="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
            takeubackward
          </span>
          <span className="inline-block rotate-180 ml-2">🚀</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
export default Navbar;
