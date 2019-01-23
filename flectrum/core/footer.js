  var instances = new Map();
  var before    = window.performance.now();
  var frameRate = 15;
  var interval  = 1000 / frameRate;
  var step_id   = 0;

  function step(now) {
    var delta = now - before;
    var obj;

    step_id = window.requestAnimationFrame(step);

    if (delta >= interval) {
      for (obj of instances.keys()) { obj.update(); }
      before = now - (delta % interval);
    }
  }
})();