from pathlib import Path
from atproto import Client, IdResolver
from random import shuffle 

client = Client()
def session_login():
    
    if Path("session.txt").exists():
        with open("session.txt", "r") as f:
            session_string = f.read()
        client.login(session_string=session_string)
        print("Session resumed")
    
    else: 
        client.login("wilif.bsky.social","VKQ@3.iL>qYw)7v")
        session_string = client.export_session_string()
        with open("session.txt", "w") as f:
            f.write(session_string)
            print("Session created")    

def is_video_post(item):
    embed = getattr(item.post, "embed", None)

    if embed is None:
        return False

    return getattr(embed, "playlist", None) is not None

def extract_video(item):
    embed = getattr(item.post, "embed", None)

    if embed is None: 
        return None

    playlist = getattr(embed, "playlist", None)
    if playlist is None: 
        return None 

    aspect_ratio = getattr(embed, "aspect_ratio", None)

    return {
        "type": "video",
        "url": playlist,
        "thumbnail": getattr(embed, "thumbnail", None),
        "alt": getattr(embed, "alt", ""),
        "width": (
            getattr(aspect_ratio, "width", None)
            if aspect_ratio is not None
            else None
        ),
        "height": (
            getattr(aspect_ratio, "height", None)
            if aspect_ratio is not None
            else None
        ),
    }

def extract_images(item):
    embed = getattr(item.post, "embed", None)

    if embed is None: 
        return None

    images = getattr(embed, "images", None)

    if not images:
        return []

    extracted_images = []

    for image in images:
        aspect_ratio = getattr(image, "aspect_ratio", None)

        extracted_images.append({
            "type": "image",
            "url": getattr(image, "fullsize", None),
            "thumbnail": getattr(image, "thumb", None),
            "alt": getattr(image, "alt", ""),
            "width": (
                getattr(aspect_ratio, "width", None)
                if aspect_ratio is not None
                else None
            ),
            "height": (
                getattr(aspect_ratio, "height", None)
                if aspect_ratio is not None
                else None
            ),
        })


def get_author_feeds():
    client.app.bsky.feed.get_actor_feeds()

def grab_post_details(item):
    post = item.post
    record = post.record

    images = extract_images(item)
    video = extract_video(item)

    media = images 

    if video is not None:
        media.append(video)

    return {
        "id": post.uri,
        "text": getattr(record, "text", ""),
        "created_at": record.created_at,
        "media": media,
        "display_name": post.author.display_name,
        "handle": post.author.handle,
        "avatar": post.author.avatar,
        "likes": post.like_count,
        "reposts": post.repost_count,
        "replies": post.reply_count,
        
    }

def get_user_posts():   
    feed = client.app.bsky.feed.get_author_feed(
        {
            "actor": client.me.did
        }
    )

    return [
        grab_post_details(item) 
        for item in feed.feed
    ]

def get_user_timeline(video_only):
    discover = client.app.bsky.feed.get_feed({
          "feed" : "at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot"
        })
    timeline = client.app.bsky.feed.get_timeline()
    combined_feed = timeline.feed + discover.feed
    shuffle(combined_feed)

    if video_only: 
        combined_feed = [
            item 
            for item in combined_feed
            if is_video_post(item)
        ]

    return [
        grab_post_details(item)
        for item in combined_feed
    ]


    


