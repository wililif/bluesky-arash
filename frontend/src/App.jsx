import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTimeline() {
      try {
        const response = await fetch("http://127.0.0.1:8000/timeline?video_only=false"); // URL can be changed depending on if video only filter is wanted:
        // Filter On: http://127.0.0.1:8000/timeline?video_only=true
        // Filter Off: http://127.0.0.1:8000/timeline?video_only=false

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTimeline();
  }, []);

  if (loading) {
    return <p>Loading timeline...</p>;
  }

  if (error) {
    return <p>Could not load timeline: {error}</p>;
  }

  return (
<main>
  <h1>Timeline</h1>

  {posts.map((post) => (
    <article key={post.id}>
      <header>
        {post.avatar && (
          <img
            src={post.avatar}
            alt=""
            width="48"
            height="48"
          />
        )}

        <div>
          <strong>{post.display_name || post.handle}</strong>
          <div>@{post.handle}</div>
        </div>
      </header>

      <p>{post.text}</p>

      {post.media?.map((media, index) => {
        const aspectRatio =
          media.width && media.height
            ? `${media.width} / ${media.height}`
            : "16 / 9";

        if (media.type === "image") {
          return (
            <img
              key={`${post.id}-media-${index}`}
              src={media.url}
              alt={media.alt || ""}
              className="post-media"
              style={{ aspectRatio }}
            />
          );
        }

        if (media.type === "video") {
          return (
            <video
              key={`${post.id}-media-${index}`}
              src={media.url}
              poster={media.thumbnail || undefined}
              className="post-media"
              style={{ aspectRatio }}
              controls
            />
          );
        }

        return null;
      })}

      <footer>
        <span>{post.replies ?? 0} replies </span>
        <span>{post.reposts ?? 0} reposts </span>
        <span>{post.likes ?? 0} likes </span>
      </footer>
    </article>
  ))}
</main>
  );
}

export default App;
  