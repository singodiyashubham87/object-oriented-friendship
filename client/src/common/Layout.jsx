import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="w-full min-h-screen max-h-screen bg-dark bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken flex flex-col items-center">
      <div className="content flex-1 w-11/12 max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] h-full relative flex flex-col gap-8 md:gap-[3.125rem] py-4 md:py-[3.125rem] items-center justify-center overflow-y-auto overflow-x-hidden">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
