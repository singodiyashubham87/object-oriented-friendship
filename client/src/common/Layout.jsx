import { SocketProvider } from "@/context/SocketContext";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <SocketProvider>
      <div className="w-full min-h-screen max-h-screen bg-dark bg-kali-mobile md:bg-kali-desktop bg-center bg-blend-darken flex flex-col items-center">
        <div className="content flex-1 w-11/12 max-w-[90vw] md:max-w-[75vw] lg:max-w-[65vw] h-full relative flex flex-col gap-8 md:gap-[3.125rem] py-4 md:py-6 items-center justify-center overflow-y-auto overflow-x-hidden">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </SocketProvider>
  );
};

export default Layout;
