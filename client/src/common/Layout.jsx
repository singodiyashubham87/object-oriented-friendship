import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="w-full min-h-screen max-h-screen bg-dark bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken py-4 md:py-[3.125rem] flex flex-col items-center">
      <div className="content flex-1 w-11/12 h-full max-w-5xl relative flex flex-col gap-8 md:gap-[3.125rem] items-center justify-center overflow-y-auto overflow-x-hidden">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
