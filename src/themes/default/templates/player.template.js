window.templates.player = `
<div id="player-thumbnail">
  <img alt="thumbnail" id="thumbnail" src="{{image.src}}"/>
</div>
<div id="player-controls">
  <div id="player-controls-buttons">
    <button id="player-previous" onclick="window.player.prev()">⏮</button>
    <button id="player-pp" onclick="window.player.play_pause()">{{playbutton}}</button>
    <button id="player-next" onclick="window.player.next()">⏭</button>
  </div>
  <div id="player-volume">
    <input id="volume" type="range" min="0" max="100" step="5" value="{{status.volume}}"/>
  </div>
</div>
<div id="player-song-data">
  <div id="player-song" title="click to seek">
    <span id='player-song-played'>{{current_song.title_played}}</span>
    <span id='player-song-unplayed'>{{current_song.title_unplayed}}</span>
  </div>
  <div id="player-song-artist">{{current_song.artist}}</div>
  <div id="player-song-album">{{current_song.album}}</div>
</div>

<div id="player-time">
  <div id="player-time-button">
    <button id="player-seek-back" onclick="window.player.seek('-10')">-10s</button>
    <button id="player-seek-forward" onclick="window.player.seek('+10')">+10s</button>
  </div>
  <div id="player-time-status">
    <span id="player-time-elapsed" data-elapsed="{{time.elapsed}}">{{time.elapsed_readable}}</span>
    <span style="padding: 0 5px;">/</span>
    <span id="player-time-duration" data-duration="{{time.elapsed}}">{{time.duration_readable}}</span>
    <span style="margin-left: 10px">(</span><span id="player-time-percent">{{time.elapsed_percent}}</span><span>)</span>
  </div>
</div>
<div id="player-modes">
  <div>
    <button class="player-mode {{status.single_active}}" id="player-mode-single" title="Single" onclick="window.player.setMode('single')">↫</button>
    <button class="player-mode {{status.repeat_active}}" id="player-mode-repeat" title="Repeat" onclick="window.player.setMode('repeat')">↺</button>
  </div>
  <div>
    <button class="player-mode {{status.random_active}}" id="player-mode-random" title="Random" onclick="window.player.setMode('random')">⇌</button>
    <button class="player-mode {{status.consume_active}}" id="player-mode-consume" title="Consume" onclick="window.player.setMode('consume')">⇏</button>
  </div>
</div>
`;