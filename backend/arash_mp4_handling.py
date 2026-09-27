import sys
from arash.dataset_gen import simulate_edits, video_compare_cv

videos = sys.argv

#for arg in sys.argv[1:]:
 #   simulate_edits.trim_video(arg, 10, 100, True)


simulate_edits.trim_video(
    video_path="3mumd5ds76s2j.mp4",
    start_frame=100,
    num_frames=100,
    show_video=True
)

video_compare_cv(
    input_path_1="app.db-x-videos-5-mp4.mp4",
    input_path_2="3mumd5ds76s2j.mp4",
    show_result="True"
)
