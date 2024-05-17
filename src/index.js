import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

let TeyutoPlayerCurrentTimeValue = 0;
let TeyutoPlayerCurrentVolumeValue = 0;

const TeyutoPlayer = forwardRef(({ posElem, obj, onPlay, onPause, onTimeUpdate, onVolumeChange }, ref) => {
  const [iframe, setIframe] = useState(null);
  const uniqueVal = React.useRef((Math.random() + 1).toString(36).substring(7)).current;

  useEffect(() => {
    if (!obj.channel) {
      console.error("Missing channel header");
      return;
    }
    console.log("INIT Teyuto Player SDK");

    const channel = obj.channel;
    const options = obj.options;
    const idVideo = obj.id;

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
      token: ''
    };

    const finalOptions = { ...defaults, ...options };

    const urlIframe = `https://teyuto.tv/video/player?w=${idVideo}&cid=${channel}&token=${finalOptions.token}&auto=${finalOptions.autoplay}&muted=${finalOptions.muted}&controls=${finalOptions.controls}&playbackRates=${finalOptions.playbackRates}&qualitySelector=${finalOptions.qualitySelector}&playerColor=${finalOptions.playerColor}&loop=${finalOptions.loop}&captions=${finalOptions.captions}&seekButtons=${finalOptions.seekButtons}&lowLatency=${finalOptions.lowLatency}`;

    const iframeContainer = document.querySelector(posElem);

    // Remove existing iframe if it exists
    const existingIframe = document.getElementById(`iframePlayerTeyuto-${uniqueVal}`);
    if (existingIframe) {
      iframeContainer.removeChild(existingIframe.parentNode);
    }

    let videoframe;
    if (finalOptions.responsive !== 'on') {
      videoframe = `<iframe id="iframePlayerTeyuto-${uniqueVal}" width="${finalOptions.width}" height="${finalOptions.height}" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"></iframe>`;
    } else {
      videoframe = `<div style="position: relative;padding-bottom: 56.25%;height: 0; overflow: hidden;"><iframe id="iframePlayerTeyuto-${uniqueVal}" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"></iframe></div>`;
    }

    iframeContainer.innerHTML = videoframe;

    const iframeElement = document.getElementById(`iframePlayerTeyuto-${uniqueVal}`);
    setIframe(iframeElement);

    const refreshData = setInterval(() => {
      try {
        iframeElement.contentWindow.postMessage(
          {
            function: "getCurrentTime"
          },
          '*'
        );

        iframeElement.contentWindow.postMessage(
          {
            function: "getVolume"
          },
          '*'
        );
      } catch (e) {
        clearInterval(refreshData);
      }
    }, 1000);

    return () => {
      clearInterval(refreshData);
      if (iframeElement && iframeElement.parentNode) {
        iframeElement.parentNode.removeChild(iframeElement);
      }
    };
  }, [obj, posElem, uniqueVal]);

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
      return TeyutoPlayerCurrentTimeValue;
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
      return TeyutoPlayerCurrentVolumeValue;
    },
    on: (...args) => {
      document.querySelector(posElem).addEventListener(...args);
    }
  }));

  useEffect(() => {
    const handleMessage = ({ data }) => {
      try {
        let event = JSON.parse(data);
        if (event.type === 'currentTime') {
          TeyutoPlayerCurrentTimeValue = event.value;
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
