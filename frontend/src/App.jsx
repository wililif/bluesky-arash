  import {
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";
import HlsVideo from "./components/HlsVideo";
import "./App.css";

const API_URL = "http://127.0.0.1:8000";

function PostList({
  endpoint,
  title,
  videoOnly = false,
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        let url = `${API_URL}${endpoint}`;

        if (endpoint === "/timeline") {
          url += `?video_only=${videoOnly}`;
        }

        console.log("Fetching:", url);

        const response = await fetch(url);

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Request failed with status ${response.status}`
          );
        }

        const data = await response.json();

        console.log("API response:", data);

        if (Array.isArray(data)) {
          setPosts(data);
        } else if (Array.isArray(data.posts)) {
          setPosts(data.posts);
        } else if (Array.isArray(data.data)) {
          setPosts(data.data);
        } else {
          console.error(
            "API did not return an array of posts:",
            data
          );

          setPosts([]);

          setError(
            "The API returned data, but it was not a list of posts. Check the browser console."
          );
        }
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [endpoint, videoOnly]);

  if (loading) {
    return (
      <main>
        <h1>{title}</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>{title}</h1>
        <p>
          <strong>Error:</strong> {error}
        </p>
        <p>
          Check the browser console for more information.
        </p>
      </main>
    );
  }

  return (
    <main>
      <h1>{title}</h1>

      {posts.length === 0 && (
        <p>No posts found.</p>
      )}

      {posts.map((post) => (
        <article
          key={post.id}
          className="post"
        >
          <header className="post-header">
            {post.avatar && (
              <img
                src={post.avatar}
                alt=""
                width="48"
                height="48"
                className="avatar"
              />
            )}

            <div>
              <strong>
                {post.display_name ||
                  post.handle ||
                  "Unknown user"}
              </strong>

              {post.handle && (
                <div>
                  @{post.handle}
                </div>
              )}
            </div>
          </header>

          {post.text && (
            <p>{post.text}</p>
          )}

          {Array.isArray(post.media) &&
            post.media.map((media, index) => {
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
                    style={{
                      aspectRatio,
                    }}
                  />
                );
              }

              if (media.type === "video") {
                return (
                  <HlsVideo
                    key={`${post.id}-media-${index}`}
                    src={media.url}
                    poster={media.thumbnail}
                    alt={
                      media.alt ||
                      "Post video"
                    }
                    aspectRatio={aspectRatio}
                    className="post-media"
                  />
                );
              }

              return null;
            })}

          <footer className="post-footer">
            <span>
              {post.replies ?? 0} replies
            </span>

            <span>
              {post.reposts ?? 0} reposts
            </span>

            <span>
              {post.likes ?? 0} likes
            </span>
          </footer>
        </article>
      ))}
    </main>
  );
}

function TimelinePage() {
  return (
    <PostList
      endpoint="/timeline"
      title="Timeline"
      videoOnly={false}
    />
  );
}

function SavedTimelinePage() {
  return (
    <PostList
      endpoint="/savedtimeline"
      title="Saved Timeline"
    />
  );
}

function PostsPage() {
  return (
    <PostList
      endpoint="/posts"
      title="My Posts"
    />
  );
}

function App() {
  return (
    <>
      <nav className="navbar">
        <Link to="/timeline">
          Timeline
        </Link>

        <Link to="/savedtimeline">
          Saved Timeline
        </Link>

        <Link to="/posts">
          My Posts
        </Link>
      </nav>

      <Routes>
        <Route
          path="/timeline"
          element={<TimelinePage />}
        />

        <Route
          path="/savedtimeline"
          element={<SavedTimelinePage />}
        />

        <Route
          path="/posts"
          element={<PostsPage />}
        />

        <Route
          path="/"
          element={
            <Navigate
              to="/timeline"
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;