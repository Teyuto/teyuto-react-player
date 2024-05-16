import React, { useState, useEffect } from 'react';

let TeyutoPlayerCurrentTimeValue = 0;
let TeyutoPlayerCurrentVolumeValue = 0;

const TeyutoPlayer = ({ posElem, obj }) => {
  const [iframe, setIframe] = useState(null);

  useEffect(() => {
    if (!obj.channel) {
      console.error("Missing channel header");
      return false;
    }

    const createIframe = () => {
      const elem = document.querySelector(posElem);
      const channel = obj.channel;
      let options = { ...obj.options }; // Using object spread to clone options object
      const idVideo = obj.id;

      if (!options.height) options.height = 315;
      if (!options.width) options.width = 560;
      if (!options.autoplay) options.autoplay = 'on';
      if (!options.muted) options.muted = 'off';
      if (!options.controls) options.controls = 'on';
      if (!options.playbackRates) options.playbackRates = 'on';
      if (!options.qualitySelector) options.qualitySelector = 'on';
      if (!options.playerColor) options.playerColor = '';
      if (!options.loop) options.loop = 'off';
      if (!options.captions) options.captions = 'on';
      if (!options.pip) options.pip = 'off';
      if (!options.seekButtons) options.seekButtons = 'off';
      if (!options.lowLatency) options.lowLatency = 'off';
      if (!options.token) options.token = '';

      const uniqueVal = (Math.random() + 1).toString(36).substring(7);

      const urlIframe = `https://teyuto.tv/video/player?w=${idVideo}&cid=${channel}&token=${options.token}&auto=${options.autoplay}&muted=${options.muted}&controls=${options.controls}&playbackRates=${options.playbackRates}&qualitySelector=${options.qualitySelector}&playerColor=${options.playerColor}&loop=${options.loop}&captions=${options.captions}&seekButtons=${options.seekButtons}&lowLatency=${options.lowLatency}`;

      const videoframe = options.responsive !== 'on' ?
        `<iframe id="iframePlayerTeyuto-${uniqueVal}" width="${options.width}" height="${options.height}" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"></iframe>` :
        `<div style="position: relative;padding-bottom: 56.25%;height: 0; overflow: hidden;"><iframe id="iframePlayerTeyuto-${uniqueVal}" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"> </iframe></div>`;

      elem.innerHTML += videoframe;

      setIframe(document.getElementById(`iframePlayerTeyuto-${uniqueVal}`));
    };

    createIframe();

    const refreshData = setInterval(() => {
      try {
        iframe.contentWindow.postMessage({ function: "getCurrentTime" }, '*');
        iframe.contentWindow.postMessage({ function: "getVolume" }, '*');
      } catch (e) {
        clearInterval(refreshData);
      }
    }, 1000);

    return () => clearInterval(refreshData);
  }, [posElem, obj, iframe]);

  const play = () => {
    iframe.contentWindow.postMessage({ function: "play" }, '*');
  };

  const pause = () => {
    iframe.contentWindow.postMessage({ function: "pause" }, '*');
  };

  const getCurrentTime = () => {
    return TeyutoPlayerCurrentTimeValue;
  };

  const setCurrentTime = (param) => {
    iframe.contentWindow.postMessage({ function: "setCurrentTime", param }, '*');
  };

  const mute = () => {
    iframe.contentWindow.postMessage({ function: "mute" }, '*');
  };

  const unmute = () => {
    iframe.contentWindow.postMessage({ function: "unmute" }, '*');
  };

  const setVolume = (param) => {
    iframe.contentWindow.postMessage({ function: "setVolume", param }, '*');
  };

  const getVolume = () => {
    return TeyutoPlayerCurrentVolumeValue;
  };

  const eventListener = ({ data }) => {
    try {
      const event = JSON.parse(data);
      if (event.type === 'currentTime') {
        TeyutoPlayerCurrentTimeValue = event.value;
      } else if (event.type === 'volume') {
        TeyutoPlayerCurrentVolumeValue = event.value;
      } else {
        const elem = document.querySelector(posElem);
        elem.dispatchEvent(new CustomEvent(event.type, { detail: { idVideo: event.idVideo, data: event.data } }));
      }
    } catch (e) {
      console.error("Error parsing event data", e);
    }
  };

  useEffect(() => {
    window.addEventListener('message', eventListener);

    return () => {
      window.removeEventListener('message', eventListener);
    };
  }, []);

  return null; // Since this component doesn't render anything visible
};

export default TeyutoPlayer;
