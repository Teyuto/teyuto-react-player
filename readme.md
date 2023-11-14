[![badge](https://img.shields.io/twitter/follow/teyuto?style=social)](https://twitter.com/intent/follow?screen_name=teyuto) &nbsp; [![badge](https://img.shields.io/github/stars/Teyuto/teyuto-player-sdk?style=social)](https://github.com/Teyuto/teyuto-player-sdk)
![](https://github.com/Teyuto/.github/blob/production/assets/img/banner.png)
<h1 align="center">Teyuto Player SDK for React Native</h1>

[Teyuto](https://teyuto.com) provides a seamless solution for managing all your video distribution needs. Whether you require video distribution in the cloud, on OTT platforms, storage, public OTT platform distribution, or secure intranet distribution, Teyuto puts everything at your fingertips, making the management of your video content effortless.

`TeyutoPlayerSdk` is a React library that allows you to embed a Teyuto video player in a React app.

## Installation

```bash
npm install --save @teyuto/react-player
```

# Usage
```jsx
import React, { useRef } from 'react';
import TeyutoPlayer from './TeyutoPlayer';

const App = () => {
  const options = {
    autoplay: 'on',
    muted: 'on',
    controls: 'on',
    responsive: 'off',
    width: 560,
    height: 300,
    playbackRates: 'on',
    qualitySelector: 'on',
    playerColor: '#dddddd',
    loop: 'off',
    captions: 'on',
  };

  const handlePlay = (data) => {
    console.log('Play event received', data);
    // Puoi gestire l'evento di riproduzione qui
  };

  const handlePause = (data) => {
    console.log('Pause event received', data);
    // Puoi gestire l'evento di pausa qui
  };

  const teyutoPlayerRef = useRef(null);

  return (
    <div>
      <TeyutoPlayerSdk
        id="10912"
        options={options}
        onPlay={handlePlay}
        onPause={handlePause}
        ref={teyutoPlayerRef}
      />

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
};

export default App;
```

Replace <VIDEO_ID> with your Teyuto video ID.