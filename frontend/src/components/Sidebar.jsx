import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 space-y-4">
      <nav className="flex flex-col gap-4">
        <Link to="/">🏠 Home</Link>
        <Link to="/reels">🎥 Reels</Link>
        <Link to="/notifications">🔔 Notifications</Link>
        <Link to="/chat">💬 Chat</Link>
        <Link to="/login">🔐 Login</Link>
      </nav>
    </aside>
  );
}