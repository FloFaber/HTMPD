window.templates.player = Handlebars.compile(`
{{#if current_song.haspicture}}
<div id="player-thumbnail">
  <a href="{{{image.src}}}">
    <img alt="thumbnail" id="thumbnail" src="{{{image.src}}}"/>
  </a>
</div>
{{/if}}
<div id="player-controls">
  <div id="player-controls-buttons">
    <button id="player-previous" onclick="window.player.prev()">⏮</button>
    <button id="player-pp" onclick="window.player.play_pause()">{{playbutton}}</button>
    <button id="player-next" onclick="window.player.next()">⏭</button>
  </div>
  <div id="player-volume">
    <input id="volume" type="range" min="0" max="100" step="5" value="{{status.volume}}"
      oninput="window.player.volume(this.value)"
      onwheel="window.player.volumeWheel(event, this);"/>
  </div>
</div>
<div id="player-song-data">
  <div id="player-song" title="click to seek" onclick="window.player.seekTo(event, this)">
    <span id='player-song-played'>{{current_song.title_played}}</span>
    <span id='player-song-unplayed'>{{current_song.title_unplayed}}</span>
  </div>
  <div id="player-song-artist"><a href="#view=artists&artist={{current_song.artist}}">{{current_song.artist}}</a></div>
  <div id="player-song-album"><a href="#view=albums&album={{current_song.album}}">{{current_song.album}}</a></div>
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
    <button class="player-mode {{status.single_active}}" id="player-mode-single" title="Single" onclick="window.player.setMode('single', !{{status.single}})">↫</button>
    <button class="player-mode {{status.repeat_active}}" id="player-mode-repeat" title="Repeat" onclick="window.player.setMode('repeat', !{{status.repeat}})">↺</button>
  </div>
  <div>
    <button class="player-mode {{status.random_active}}" id="player-mode-random" title="Random" onclick="window.player.setMode('random', !{{status.random}})">⇌</button>
    <button class="player-mode {{status.consume_active}}" id="player-mode-consume" title="Consume" onclick="window.player.setMode('consume', !{{status.consume}})">⇏</button>
  </div>
</div>
`.replace(/\n(\s*)/g, ""));