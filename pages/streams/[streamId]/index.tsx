import { useState } from "react";
import { useSignMessage } from "wagmi";
import { getStream } from "../../api/_util/livepeer";
import Player from "../../../components/VideoPlayer";
import type { Stream } from "../../api/_util/livepeer";

interface Props {
  stream: Stream;
}

const POLLING_INTERVAL_MS = 1000 * 5;

const constructPlaybackUrl = (playbackId: string, params?: any) => {
  let url = `https://playback.livepeer.engineering/hls/${playbackId}/index.m3u8`;

  if (params) {
    url += "?" + new URLSearchParams(params).toString();
  }

  console.log(url);

  return url;
};

export default function StreamPage({ stream }: Props) {
  const [playbackUrl, setPlaybackUrl] = useState<string>(
    constructPlaybackUrl(stream.playbackId)
  );
  const [signature, setSignature] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState(1000 * 10);
  const { signMessage } = useSignMessage({
    onSuccess(data, vars) {
      setSignature(data);
      setPlaybackUrl(
        constructPlaybackUrl(stream.playbackId, {
          sig: data,
          message: vars.message,
          streamId: stream.id,
        })
      );
    },
  });

  const getSignature = () => {
    if (!signature) {
      signMessage({ message: "StreamBot is just verifying you! Beep boop!" });
    }
  };

  return (
    <div>
      {stream.isActive && (
        <div className="flex justify-end mr-2 mb-2">LIVE</div>
      )}
      <Player src={playbackUrl} poster="" onPlay={getSignature} />
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  let stream = null;
  const streamId = context.query.streamId;

  try {
    stream = await getStream(streamId);

    return {
      props: {
        stream: {
          id: stream.id,
          name: stream.name,
          playbackId: stream.playbackId,
          isActive: stream.isActive,
        },
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};
