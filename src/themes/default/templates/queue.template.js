window.templates.queue = `

  <h2>Queue</h2>

  <div id="action-buttons">
    <button id="queue-clear">clear</button>
    <button id="queue-shuffle">shuffle</button>
    <button id="queue-save">save...</button>
    <button id="queue-add">add...</button>
  </div>

  <table id="queue-items">
    {{queue_items@queue_item}}
  </table>

`;

window.templates.queue_item = `
  <tr>
    <td>{{file}}</td>
  </tr>
`;