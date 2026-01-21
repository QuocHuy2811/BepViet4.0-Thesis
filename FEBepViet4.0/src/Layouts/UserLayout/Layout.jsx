import React from "react";
import { Outlet } from "react-router-dom";
import { DesktopSidebar } from "./Navigation.jsx";
import Footer from "./Footer.jsx";

const Layout = ({token,setUser}) => {

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <DesktopSidebar  token={token} setUser={setUser}/>
      {/* Main Content Area + Footer */}
      <div className="md:ml-64 flex flex-col flex-1 min-h-screen">
        <main className="flex-1 w-full transition-all duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;