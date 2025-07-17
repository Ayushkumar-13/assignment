import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import PostCard from "../../components/PostCard";
import { API_BASE_URL } from "../../constants/global";
import { useAuth } from "../../context/AuthContext";

// Dummy posts
const dummyPosts = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  caption: `This is dummy post #${i + 1}`,
  author: `user${i + 1}`,
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 10),
  createdAt: new Date(Date.now() - i * 60000).toISOString(), // spaced by 1 min
  image: `https://source.unsplash.com/random/600x400?sig=${i}`,
}));

export default function Home() {
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState(dummyPosts.slice(0, 6));
  const [page, setPage] = useState(1);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const more = dummyPosts.slice(page * 6, (page + 1) * 6);
    if (more.length > 0) {
      setPosts((prev) => [...prev, ...more]);
    }
  }, [page]);

  // Simulate adding a post locally
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      caption,
      author: user?.username || "anon",
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      image: preview || "https://via.placeholder.com/600x400",
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setCaption("");
    setImage(null);
    setPreview(null);
    alert("Post added successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-4">
      <h1 className="text-2xl font-bold mb-4">🏠 Home Feed</h1>
      <Button onClick={() => setIsModalOpen(true)}>➕ Create Post</Button>

      {/* Create Post Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-2">Create Post</h2>
        <form className="space-y-4" onSubmit={handlePostSubmit}>
          <div>
            <label htmlFor="caption" className="block font-medium">
              Caption
            </label>
            <input
              id="caption"
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="image" className="block font-medium">
              Image Upload
            </label>
            <input
              id="image"
              type="file"
              className="w-full"
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 max-h-60 rounded shadow"
              />
            )}
          </div>
          <Button type="submit">📤 Post</Button>
        </form>
      </Modal>

      {/* Post Feed */}
      <div className="mt-6 space-y-4">
        {posts.length === 0 ? (
          <p>No posts yet. Be the first to share!</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
