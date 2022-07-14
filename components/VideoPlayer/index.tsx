import { useRef } from "react";
import { VideoJsPlayer } from "video.js";
import VideoJs from "./Providers/Video.js";

interface Props {
  src: string | null;
  poster: string;
  onPlay: () => void;
}

const Player = ({ src, poster, onPlay }: Props) => {
  const playerRef = useRef<null | VideoJsPlayer>(null);

  if (!src) return null;

  // this needs to be abstracted more for compatibility with other players
  const videoJsOptions: any = {
    poster: poster || "",
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: src,
        type: "application/x-mpegURL",
      },
    ],
  };

  // if (src) {
  //   videoJsOptions.sources.push({
  //     src: src,
  //     type: "application/x-mpegURL",
  //   });
  // }

  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;

    player.bigPlayButton.on("click", () => {
      onPlay();
    });

    player.on("pause", () => {
      console.log("pause");
    });

    player.on("error", (e: any) => {
      console.log("error", e);
    });

    player.on("waiting", () => {
      console.log("player is waiting");
      // player.pause();
      // const currentPlaylist = player.tech().vhs.playlists.media();
      // if (currentPlaylist?.custom?.livepeerError) {
      //   player.error(4);
      // }
    });
  };

  return <VideoJs options={videoJsOptions} onReady={handlePlayerReady} />;
};

export default Player;
