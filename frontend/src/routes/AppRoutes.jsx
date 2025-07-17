import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Reels from "../pages/Reels/Reels";
import Notifications from "../pages/Notifications/Notifications";
import Chat from "../pages/Chat/Chat";
import Login from "../pages/Login/Login";
import Profile from "../pages/Profile/Profile";
import PostDetails from "../pages/PostDetails/PostDetails";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reels" element={<Reels />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/post/:postId" element={<PostDetails />} />
    </Routes>
  );
}