import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface PlayerOptions {
  autoplay: boolean;
  muted: boolean;
  controls: boolean;
  playbackRates: number[];
  qualitySelector: boolean;
  playerColor: string;
  loop: boolean;
  captions: boolean;
  responsive: string;
  width: number;
  height: number;
}

interface PlayerProps {
  id: string;
  options: PlayerOptions;
  onPlay?: (data: any) => void;
  onPause?: (data: any) => void;
}

const TeyutoPlayerSdk = forwardRef(({ id, options, onPlay, onPause }: PlayerProps, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);

  useEffect(() => {
    const urlIframe = `https://teyuto.tv/video/player?w=${id}&auto=${options.autoplay}&muted=${options.muted}&controls=${options.controls}&playbackRates=${options.playbackRates}&qualitySelector=${options.qualitySelector}&playerColor=${options.playerColor}&loop=${options.loop}&captions=${options.captions}`;

    const refreshData = setInterval(() => {
      try {
        iframeRef.current!.contentWindow!.postMessage(
          { function: 'getCurrentTime' },
          '*'
        );

        iframeRef.current!.contentWindow!.postMessage(
          { function: 'getVolume' },
          '*'
        );
      } catch (e) {
        clearInterval(refreshData);
      }
    }, 1000);

    const handleMessage = ({ data }: { data: any }) => {
      try {
        const event = JSON.parse(data);
        if (event.type === 'currentTime') {
          setCurrentTime(event.value);
        } else if (event.type === 'volume') {
          setCurrentVolume(event.value);
        } else if (event.type === 'play') {
          onPlay && onPlay(event.data);
        } else if (event.type === 'pause') {
          onPause && onPause(event.data);
        } else {
          document.dispatchEvent(new CustomEvent(event.type, { detail: { idVideo: event.idVideo, data: event.data } }));
        }
      } catch (e) {}
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(refreshData);
      window.removeEventListener('message', handleMessage);
    };
  }, [id, options.autoplay, options.muted, options.controls, options.playbackRates, options.qualitySelector, options.playerColor, options.loop, options.captions]);

  useImperativeHandle(ref, () => ({
    play: () => {
      iframeRef.current!.contentWindow!.postMessage({ function: 'play' }, '*');
    },
    pause: () => {
      iframeRef.current!.contentWindow!.postMessage({ function: 'pause' }, '*');
    },
    setVolume: (volume: number) => {
      iframeRef.current!.contentWindow!.postMessage(
        { function: 'setVolume', param: volume },
        '*'
      );
    },
    getCurrentTime: () => currentTime,
    getVolume: () => currentVolume,
    setCurrentTime: (time: number) => {
      iframeRef.current!.contentWindow!.postMessage(
        { function: 'setCurrentTime', param: time },
        '*'
      );
    },
  }));

  return (
    <>
      {options.responsive !== 'on' ? (
        <iframe
          ref={iframeRef}
          width={options.width}
          height={options.height}
          src={urlIframe}
          frameBorder="0"
          allowFullScreen={true}
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          scrolling="no"
        ></iframe>
      ) : (
        <div
          style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
            src={urlIframe}
            frameBorder="0"
            allowFullScreen={true}
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            scrolling="no"
          ></iframe>
        </div>
      )}
    </>
  );
});

export default TeyutoPlayerSdk;
