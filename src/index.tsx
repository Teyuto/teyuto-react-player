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
    console.log("INIT Teyuto Player SDK");

    const channel = obj.channel;
    const options = obj.options;
    const idVideo = obj.id;

    let videoframe = '';

    let uniqueVal = (Math.random() + 1).toString(36).substring(7);

    if (!options.height) {
      options.height = 315;
    }
    if (!options.width) {
      options.width = 560;
    }
    if (!options.autoplay) {
      options.autoplay = 'on';
    }
    if (!options.muted) {
      options.muted = 'off';
    }
    if (!options.controls) {
      options.controls = 'on';
    }
    if (!options.playbackRates) {
      options.playbackRates = 'on';
    }
    if (!options.qualitySelector) {
      options.qualitySelector = 'on';
    }
    if (!options.playerColor) {
      options.playerColor = '';
    }
    if (!options.loop) {
      options.loop = 'off';
    }
    if (!options.captions) {
      options.captions = 'on';
    }
    if (!options.pip) {
      options.pip = 'off';
    }
    if (!options.seekButtons) {
      options.seekButtons = 'off';
    }
    if (!options.lowLatency) {
      options.lowLatency = 'off';
    }
    if (!options.token) {
      options.token = '';
    }

    const urlIframe = `https://teyuto.tv/video/player?w=${idVideo}&cid=${channel}&token=${options.token}&auto=${options.autoplay}&muted=${options.muted}&controls=${options.controls}&playbackRates=${options.playbackRates}&qualitySelector=${options.qualitySelector}&playerColor=${options.playerColor}&loop=${options.loop}&captions=${options.captions}&seekButtons=${options.seekButtons}&lowLatency=${options.lowLatency}`;

    if (options.responsive !== 'on') {
      videoframe = `<iframe id="iframePlayerTeyuto-${uniqueVal}" width="${options.width}" height="${options.height}" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"></iframe>`;
    } else {
      videoframe = `<div style="position: relative;padding-bottom: 56.25%;height: 0; overflow: hidden;"><iframe id="iframePlayerTeyuto-${uniqueVal}" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" src="${urlIframe}" frameborder="0" allow="autoplay" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"> </iframe></div>`;
    }

    document.querySelector(`' + ${posElem} + '`).innerHTML += videoframe;

    const iframe = document.getElementById(`iframePlayerTeyuto-${uniqueVal}`);
    setIframe(iframe);

    const refreshData = setInterval(() => {
      try {
        iframe.contentWindow.postMessage(
          {
            function: "getCurrentTime"
          },
          '*'
        );

        iframe.contentWindow.postMessage(
          {
            function: "getVolume"
          },
          '*'
        );
      } catch (e) {
        clearInterval(refreshData);
      }
    }, 1000);

    return () => clearInterval(refreshData);
  }, []);

  const play = (param) => {
    iframe.contentWindow.postMessage(
      {
        function: "play"
      },
      '*'
    );
  }

  const pause = (param) => {
    iframe.contentWindow.postMessage(
      {
        function: "pause"
      },
      '*'
    );
  }

  const getCurrentTime = () => {
    return TeyutoPlayerCurrentTimeValue;
  }

  const setCurrentTime = (param) => {
    iframe.contentWindow.postMessage(
      {
        function: "setCurrentTime",
        param: param
      },
      '*'
    );
  }

  const mute = (param) => {
    iframe.contentWindow.postMessage(
      {
        function: "mute"
      },
      '*'
    );
  }

  const unmute = (param) => {
    iframe.contentWindow.postMessage(
      {
        function: "unmute"
      },
      '*'
    );
  }

  const setVolume = (param) => {
    iframe.contentWindow.postMessage(
      {
        function: "setVolume",
        param: param
      },
      '*'
    );
  }

  const getVolume = (param) => {
    return TeyutoPlayerCurrentVolumeValue;
  }

  const on = (...args) => {
    document.querySelector(posElem).addEventListener(...args);
  }

  window.addEventListener('message', ({ data }) => {
    try {
      let event = JSON.parse(data);
      if (event.type == 'currentTime') {
        TeyutoPlayerCurrentTimeValue = event.value;
      }
      else if (event.type == 'volume') {
        TeyutoPlayerCurrentVolumeValue = event.value;
      } else {
        document.querySelector(posElem).dispatchEvent(new CustomEvent(event.type, { detail: { idVideo: event.idVideo, data: event.data } }));
      }
    } catch (e) {

    }
  });

  return null;
}

export default TeyutoPlayer;
