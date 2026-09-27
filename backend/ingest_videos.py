import json
import subprocess
import tempfile
from pathlib import Path

from database import init_db, save_video, video_exists


TIMELINE_PATH = Path(__file__).parent / "timeline.json"


def load_timeline():
    with open(
        TIMELINE_PATH,
        "r",
        encoding="utf-8"
    ) as file:
        timeline = json.load(file)

    return timeline


def extract_videos(timeline):
    videos = []

    for post in timeline:
        uri = post.get("id")
        media_items = post.get("media", [])

        for media in media_items:
            if media.get("type") == "video":
                playlist_url = media.get("url")

                if uri and playlist_url:
                    videos.append({
                        "uri": uri,
                        "playlist_url": playlist_url
                    })

    return videos


def filename_from_uri(uri: str) -> str:
    post_id = uri.split("/")[-1]

    return f"{post_id}.mp4"


def convert_to_mp4(
    playlist_url: str,
    output_path: Path
):
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i", playlist_url,
            "-c", "copy",
            "-movflags", "+faststart",
            str(output_path)
        ],
        check=True
    )


def process_video(
    uri: str,
    playlist_url: str
):
    if video_exists(uri):
        print(f"Already stored: {uri}")
        return

    filename = filename_from_uri(uri)

    with tempfile.TemporaryDirectory() as temp_directory:

        output_path = (
            Path(temp_directory) / filename
        )

        print(f"Converting: {filename}")

        convert_to_mp4(
            playlist_url,
            output_path
        )

        video_bytes = output_path.read_bytes()

        save_video(
            uri=uri,
            filename=filename,
            video_bytes=video_bytes
        )

    print(f"Saved: {filename}")


def main():
    init_db()

    timeline = load_timeline()

    videos = extract_videos(timeline)

    print(
        f"Found {len(videos)} video(s)"
    )

    for video in videos:

        try:
            process_video(
                uri=video["uri"],
                playlist_url=video["playlist_url"]
            )

        except subprocess.CalledProcessError as error:
            print(
                f"FFmpeg failed for "
                f"{video['uri']}: {error}"
            )


if __name__ == "__main__":
    main()