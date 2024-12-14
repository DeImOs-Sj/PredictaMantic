import {
  ChartBarBig,
  GalleryHorizontalEnd,
  LayoutList,
  Plus,
  UserRound,
} from "lucide-react";

interface NavbarProps {
  children: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <nav className="z-40">
      <div className="fixed top-0 left-0 right-0 flex flex-row justify-between items-center bg-[#efe7f7] border-black border-b-2">
        <div className="inline-flex items-center gap-2 p-4">
          <img src="/logo-black.png" alt="Vortis" className="w-8 h-8" />
          <span className="font-brice-black text-2xl">Vortis</span>
        </div>
      </div>
      <div>{children}</div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#efe7f7] w-full flex flex-row justify-between gap-12 border-black border-t-2">
        <div className="relative flex flex-row justify-between px-5 w-full">
          <a href="/" className="p-4">
            <GalleryHorizontalEnd size={25} />
          </a>
          <a href="/markets" className="p-4">
            <LayoutList size={25} />
          </a>
        </div>
        <a
          href="/create"
          className="p-4 absolute -top-1/2 left-0 right-0 rounded-full w-fit mx-auto bg-[#d3aeff] border-black border-2"
        >
          <Plus />
        </a>
        <div className="relative flex flex-row justify-between px-5 w-full">
          <a href="/positions" className="p-4">
            <ChartBarBig size={25} />
          </a>
          <a href="/profile" className="p-4">
            <UserRound size={25} />
          </a>
        </div>
      </div>
    </nav>
  );
};
