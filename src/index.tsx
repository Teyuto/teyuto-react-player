import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface TeyutoPlayerSdkProps {
  id: string;
  options: {
    autoplay: boolean;
    muted: boolean;
    controls: boolean;
    playbackRates: number[];
    qualitySelector: boolean;
    playerColor: string;
    loop: boolean;
    captions: boolean;
    responsive: string;
    width: string;
    height: string;
  };
  onPlay?: (data: any) => void;
  onPause?: (data: any) => void;
}

interface TeyutoPlayerSdkRef {
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getVolume: () => number;
  setCurrentTime: (time: number) => void;
}

const TeyutoPlayerSdk = forwardRef<HTMLIFrameElement & TeyutoPlayerSdkRef, TeyutoPlayerSdkProps>((props, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);
  const urlIframe = `https://teyuto.tv/video/player?w=${props.id}&auto=${props.options.autoplay}&muted=${props.options.muted}&controls=${props.options.controls}&playbackRates=${props.options.playbackRates}&qualitySelector=${props.options.qualitySelector}&playerColor=${props.options.playerColor}&loop=${props.options.loop}&captions=${props.options.captions}`;

  useEffect(() => {
    const refreshData = setInterval(() => {
      try {
        iframeRef.current?.contentWindow?.postMessage(
          { function: 'getCurrentTime' },
          '*'
        );

        iframeRef.current?.contentWindow?.postMessage(
          { function: 'getVolume' },
          '*'
        );
      } catch (e) {
        clearInterval(refreshData);
      }
    }, 1000);

    const handleMessage = ({ data }: { data: string }) => {
      try {
        const event = JSON.parse(data);
        if (event.type === 'currentTime') {
          setCurrentTime(event.value);
        } else if (event.type === 'volume') {
          setCurrentVolume(event.value);
        } else if (event.type === 'play') {
          props.onPlay && props.onPlay(event.data); 
        } else if (event.type === 'pause') {
          props.onPause && props.onPause(event.data); 
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
  }, [props.id, props.options.autoplay, props.options.muted, props.options.controls, props.options.playbackRates, props.options.qualitySelector, props.options.playerColor, props.options.loop, props.options.captions, props.onPlay, props.onPause]);

  useImperativeHandle(ref, () => ({
    play: () => {
      iframeRef.current?.contentWindow?.postMessage({ function: 'play' }, '*');
    },
    pause: () => {
      iframeRef.current?.contentWindow?.postMessage({ function: 'pause' }, '*');
    },
    setVolume: (volume: number) => {
      iframeRef.current?.contentWindow?.postMessage(
        { function: 'setVolume', param: volume },
        '*'
      );
    },
    getCurrentTime: () => currentTime,
    getVolume: () => currentVolume,
    setCurrentTime: (time: number) => {
      iframeRef.current?.contentWindow?.postMessage(
        { function: 'setCurrentTime', param: time },
        '*'
      );
    },
  }));

  return (
    <>
      {props.options.responsive !== 'on' ? (
        <iframe
          ref={iframeRef}
          width={props.options.width}
          height={props.options.height}
          src={urlIframe}
          frameBorder="0"
          allowFullScreen={true}
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          scrolling="no"
          {...(props.options.responsive !== 'on' ? {} : { style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } })}
          // Utilizza l'attributo 'as' per specificare il tipo dell'elemento
          // as="iframe"
        />
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
            // Utilizza l'attributo 'as' per specificare il tipo dell'elemento
            // as="iframe"
          />
        </div>
      )}
    </>
  );
});

export default TeyutoPlayerSdk;
