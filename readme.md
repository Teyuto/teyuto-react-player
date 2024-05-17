[![badge](https://img.shields.io/twitter/follow/teyuto?style=social)](https://twitter.com/intent/follow?screen_name=teyuto) &nbsp; [![badge](https://img.shields.io/github/stars/Teyuto/teyuto-player-sdk?style=social)](https://github.com/Teyuto/teyuto-player-sdk)
![](https://github.com/Teyuto/.github/blob/production/assets/img/banner.png)
<h1 align="center">Teyuto Player SDK for React</h1>

[Teyuto](https://teyuto.com) provides a seamless solution for managing all your video distribution needs. Whether you require video distribution in the cloud, on OTT platforms, storage, public OTT platform distribution, or secure intranet distribution, Teyuto puts everything at your fingertips, making the management of your video content effortless.

`Teyuto React Player` is a React library that allows you to embed a Teyuto Video Player in a React app.

## Installation

```bash
npm install --save @teyuto/react-player
```

# Usage
```jsx
import React, { useState, useRef } from 'react';
import TeyutoPlayer from '@teyuto/react-player';


const App = () => {
  const [setCurrentTime] = useState(0);
  const [setVolume] = useState(0);
  const teyutoPlayerRef = useRef(null);

  const obj = {
    channel: '<CHANNEL_PUBLIC>', //required
    id: '<VIDEO_ID>',  //required
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
```

Replace <VIDEO_ID> with your Teyuto video ID.