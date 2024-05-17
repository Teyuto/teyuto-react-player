import React, { useState, useRef } from 'react';
import TeyutoPlayer from './TeyutoPlayer';

const App = () => {
  const [setCurrentTime] = useState(0);
  const [setVolume] = useState(0);
  const teyutoPlayerRef = useRef(null);

  const obj = {
    channel: '30Y8zKKY9H3IUaImUidzCqa5852a1cead3fb2b2ef79cf6baf04909', //required
    id: '46760',  //required
    options: {
      autoplay: 'on',
      muted: 'off',
      controls: 'on',
      playbackRates: 'on',
      qualitySelector: 'on',
      playerColor: '#dddddd',
      loop: 'off',
      captions: 'on',
      seekButtons: 'off',
      lowLatency: 'off',
      token: 'your_api_token'
    }
  };

  const handlePlay = () => {
    console.log('Video started playing');
  };

  const handlePause = () => {
    console.log('Video paused');
  };

  return (
    <div>
      <TeyutoPlayer
        ref={teyutoPlayerRef}
        posElem="#player-container"
        obj={obj}
        onPlay={handlePlay}
        onPause={handlePause}
      />
      <div id="player-container"></div>
      <button onClick={() => teyutoPlayerRef.current.play()}>Play</button>
      <button onClick={() => teyutoPlayerRef.current.pause()}>Pause</button>
      <button onClick={() => teyutoPlayerRef.current.setVolume(0)}>Mute</button>
      <button onClick={() => teyutoPlayerRef.current.setVolume(1)}>Unmute</button>
      <button onClick={() => alert(teyutoPlayerRef.current.getCurrentTime())}>GetCurrentTime</button>
      <button onClick={() => alert(teyutoPlayerRef.current.getVolume())}>GetVolume</button>
      <button onClick={() => teyutoPlayerRef.current.setCurrentTime(15)}>SetCurrentTime (15 seconds)</button>
      <button onClick={() => teyutoPlayerRef.current.setVolume(0.5)}>SetVolume (0.5)</button>
    </div>
  );
}

export default App;
