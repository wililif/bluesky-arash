import { useEffect, useRef } from "react";
import Hls from "hls.js";

function HlsVideo({
  src,
  poster,
  alt = "Post video",
  aspectRatio = "16 / 9",
  className = "",
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !src) {
      return;
    }

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();

      hls.loadSource(src);

      hls.attachMedia(videoElement);

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS playback error:", data);
      });
    }

    else if (
      videoElement.canPlayType("application/vnd.apple.mpegurl")
    ) {
      videoElement.src = src;
    }

    else {
      console.error("This browser does not support HLS video.");
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
      controls
      playsInline
      preload="metadata"
      poster={poster || undefined}
      aria-label={alt}
      className={className}
      style={{ aspectRatio }}
    />
  );
}

export default HlsVideo;