# Theming

src/themes/<NAME>/
 templates/
  components/
   player.comp.js
   sidebar.comp.js
   queue.comp.js
  views/
   main.view.js - includes:
    player.comp.js
    sidebar.comp.js
    queue.comp.js
    
 css/
  player.css
  sidebar.css
  queue.css


# Events

Main
 Default
  onPageLoad
 Custom

Player
 onPause
 onVolumeChange

Queue
 onSongSelect
 onClear


When the page is loaded:
 * Render main.view.js (and include components)
 * Retrieve data from API, call hooks and rerender
 * 