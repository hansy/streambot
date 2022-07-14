import { useRef, useEffect } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import qualitySelector from "videojs-hls-quality-selector";
import contribQualityLevels from "videojs-contrib-quality-levels";
import "video.js/dist/video-js.css";

interface Props {
  options: VideoJsPlayerOptions;
  onReady: (player: VideoJsPlayer) => void;
}
export default function VideoJs({ options, onReady }: Props) {
  const videoRef = useRef(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    // make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      videojs.registerPlugin("hlsQualitySelector", qualitySelector);
      videojs.registerPlugin("qualityLevels", contribQualityLevels);

      const player = (playerRef.current = videojs(
        videoElement,
        {
          ...options,
          html5: {
            vhs: {
              customTagParsers: [
                {
                  expression: /#EXT-X-ERROR/,
                  customType: "livepeerError",
                },
              ],
            },
          },
        },
        () => {
          onReady && onReady(player);
        }
      ));
    } else {
      const player = playerRef.current;

      // prevent player from reloading the same src, causing interrupted playback
      if (options.sources) {
        if (player.src() !== options.sources[0].src) {
          player.src(options.sources);
        }
      }
    }
  }, [options, videoRef]);

  useEffect(() => {
    const player = playerRef.current;

    if (player) player.hlsQualitySelector({ displayCurrentQuality: true });

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player style={{ borderRadius: "5px" }}>
      <video
        ref={videoRef}
        preload="none"
        className="video-js vjs-16-9 vjs-big-play-centered"
      />
    </div>
  );
}
