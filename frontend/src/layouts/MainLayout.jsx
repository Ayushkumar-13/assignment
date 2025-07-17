import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  const location = useLocation();
  const isReelsPage = location.pathname === "/reels";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {!isReelsPage && <Navbar />}
        <main className={`overflow-y-auto ${isReelsPage ? 'p-0' : 'p-4'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
