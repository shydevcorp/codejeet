import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="font-bold text-2xl">takeubackward</div>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
``;
