var intro = {};

(function() {

  var onClick = null,
    clicked = false;

  intro.stopLoading = function() {
    document.getElementById('loading-overlay').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('loading-overlay').style.display = 'none';
    }, 250);
  };

  intro.onClick = function(handler) {
    onClick = handler;

    if (clicked)
      handler();
  };

  if (1 || localStorage.getItem('zb3.rw3D.acked') !== '1') {
    document.getElementById('msg-overlay').style.display = 'block';
  }

  document.getElementById('okbutton').onclick = document.getElementById('okbutton').ontouchstart = ackMsg;

  function ackMsg() {
    localStorage.setItem('zb3.rw3D.acked', '1');

    document.getElementById('msg-overlay').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('msg-overlay').style.display = 'none';

      clicked = true;
      if (onClick)
        onClick();
    }, 250);
  }

})();