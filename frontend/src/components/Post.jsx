function Post({ post }) {
  return (
    <article className="post">
      <h3>{post.author.displayName}</h3>

      <p>{post.text}</p>

      {post.video && (
        <VideoPlayer video={post.video} />
      )}
    </article>
  );
}