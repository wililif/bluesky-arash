import { useEffect, useRef } from "react";
import Hls from "hls.js";

function HlsVideo({
  src,
  poster,
  aspectRatio = "16 / 9",
  className = "",
}) {
  const videoRef = useRef(null);

useEffect(() => {
  const video = videoRef.current;

  if (!video || !src) {
    return;
  }

  let hls;

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = src;
    video.load();
  } else if (Hls.isSupported()) {
    hls = new Hls({
      debug: true,
    });

    hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
      console.log("Manifest parsed:", data);
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      console.error("HLS error:", {
        type: data.type,
        details: data.details,
        fatal: data.fatal,
      });
    });

    hls.loadSource(src);
    hls.attachMedia(video);
  } else {
    console.error("HLS is not supported in this browser.");
  }

  return () => {
    if (hls) {
      hls.destroy();
    }
  };
}, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster || undefined}
      className={className}
      style={{ aspectRatio }}
      controls
      preload="metadata"
      playsInline
    >
      Your browser does not support video playback.
    </video>
  );
}

export default HlsVideo;