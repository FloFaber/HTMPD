window.templates.player = `
<div id="player-thumbnail">
  <img alt="thumbnail" id="thumbnail"/>
</div>
<div id="player-controls">
  <div id="player-controls-buttons">
    <button id="player-previous">⏮</button>
    <button id="player-pp">PP</button>
    <button id="player-next">⏭</button>
  </div>
  <div id="player-volume">
    <input id="volume" type="range" min="0" max="100" step="5"/>
  </div>
</div>
<div id="player-song-data">
  <div id="player-song" title="click to seek">N/A</div>
  <div id="player-song-artist"></div>
</div>

<div id="player-time">
  <div id="player-time-button">
    <button id="player-seek-back">-10s</button>
    <button id="player-seek-forward">+10s</button>
  </div>
  <div id="player-time-status">
    <span id="player-time-elapsed">00:00</span>
    <span>/</span>
    <span id="player-time-duration">00:00</span>
    <span>(</span><span id="player-time-percent">0%</span><span>)</span>
  </div>
</div>
<div id="player-modes">
  <div>
    <button class="player-mode" id="player-mode-single" title="Single" data-mode="single">↫</button>
    <button class="player-mode" id="player-mode-repeat" title="Repeat" data-mode="repeat">↺</button>
  </div>
  <div>
    <button class="player-mode" id="player-mode-random" title="Random" data-mode="random">⇌</button>
    <button class="player-mode" id="player-mode-consume" title="Consume" data-mode="consume">⇏</button>
  </div>
</div>
`;