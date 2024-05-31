import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

let TeyutoPlayerCurrentTimeValue = [];
let TeyutoPlayerCurrentVolumeValue = [];

const TeyutoPlayer = forwardRef(({ posElem, obj, onPlay, onPause, onTimeUpdate, onVolumeChange }, ref) => {
  const [iframe, setIframe] = useState(null);
  const idVideo = obj.id;

  useEffect(() => {
    if (!obj.channel) {
      console.error("Missing channel header");
      return;
    }
    console.log("INIT Teyuto Player SDK");

    const channel = obj.channel;
    const options = obj.options;

    const defaults = {
      height: 315,
      width: 560,
      autoplay: 'on',
      muted: 'off',
      controls: 'on',
      playbackRates: 'on',
      qualitySelector: 'on',
      playerColor: '',
      loop: 'off',
      captions: 'on',
      pip: 'off',
      seekButtons: 'off',
      lowLatency: 'off',
      related: '',
      relatedTags: '',
      adTag: '',
      token: ''
    };

    const finalOptions = { ...defaults, ...options };

    const urlIframe = `https://teyuto.tv/video/player?w=${idVideo}&cid=${channel}&token=${finalOptions.token}&auto=${finalOptions.autoplay}&muted=${finalOptions.muted}&controls=${finalOptions.controls}&playbackRates=${finalOptions.playbackRates}&qualitySelector=${finalOptions.qualitySelector}&playerColor=${finalOptions.playerColor}&loop=${finalOptions.loop}&captions=${finalOptions.captions}&seekButtons=${finalOptions.seekButtons}&lowLatency=${finalOptions.lowLatency}&related=${finalOptions.related}&relatedTags=${finalOptions.relatedTags}&adTag=${finalOptions.adTag}`;

    const iframeElement = document.getElementById(`iframePlayerTeyuto-${idVideo}`);
    if (!iframeElement) {
      // If the iframe doesn't exist, create it
      let videoframe;
      if (finalOptions.responsive !== 'on') {
        videoframe = `<iframe id="iframePlayerTeyuto-${idVideo}" width="${finalOptions.width}" height="${finalOptions.height}" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"></iframe>`;
      } else {
        videoframe = `<div style="position: relative;padding-bottom: 56.25%;height: 0; overflow: hidden;"><iframe id="iframePlayerTeyuto-${idVideo}" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"></iframe></div>`;
      }
      document.querySelector(posElem).innerHTML = videoframe;
      setIframe(document.getElementById(`iframePlayerTeyuto-${idVideo}`));
    } else {
      // If the iframe already exists, update its properties
      iframeElement.src = urlIframe;
      iframeElement.width = finalOptions.width;
      iframeElement.height = finalOptions.height;
    }

  }, [obj, posElem, idVideo]);

  useImperativeHandle(ref, () => ({
    play: () => {
      iframe.contentWindow.postMessage(
        {
          function: "play"
        },
        '*'
      );
    },
    pause: () => {
      iframe.contentWindow.postMessage(
        {
          function: "pause"
        },
        '*'
      );
    },
    getCurrentTime: () => {
      return TeyutoPlayerCurrentTimeValue[idVideo];
    },
    setCurrentTime: (param) => {
      iframe.contentWindow.postMessage(
        {
          function: "setCurrentTime",
          param: param
        },
        '*'
      );
    },
    mute: () => {
      iframe.contentWindow.postMessage(
        {
          function: "mute"
        },
        '*'
      );
    },
    unmute: () => {
      iframe.contentWindow.postMessage(
        {
          function: "unmute"
        },
        '*'
      );
    },
    setVolume: (param) => {
      iframe.contentWindow.postMessage(
        {
          function: "setVolume",
          param: param
        },
        '*'
      );
    },
    getVolume: () => {
      return TeyutoPlayerCurrentVolumeValue[idVideo];
    },
    on: (...args) => {
      document.querySelector(posElem).addEventListener(...args);
    }
  }));

  useEffect(() => {
    const handleMessage = ({ data }) => {
      try {
        let event = JSON.parse(data);
        console.log(event);
        TeyutoPlayerCurrentTimeValue[event.idVideo] = event.values.time;
        TeyutoPlayerCurrentVolumeValue[event.idVideo] = event.values.volume;
        if (event.type === 'currentTime') {
          if (onTimeUpdate) onTimeUpdate(event.value);
        }
        else if (event.type === 'volume') {
          TeyutoPlayerCurrentVolumeValue = event.value;
          if (onVolumeChange) onVolumeChange(event.value);
        } else {
          document.querySelector(posElem).dispatchEvent(new CustomEvent(event.type, { detail: { idVideo: event.idVideo, data: event.data } }));
          if (event.type === 'play' && onPlay) onPlay();
          if (event.type === 'pause' && onPause) onPause();
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onPlay, onPause, onTimeUpdate, onVolumeChange, posElem]);

  return null;
});

export default TeyutoPlayer;
