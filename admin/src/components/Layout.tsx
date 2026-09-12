import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="ml-64 min-h-screen px-10 py-9">
        <Outlet />
      </main>
    </div>
  );
}
