document.addEventListener("DOMContentLoaded", () => {
"use strict";

  const MOBILE = /Mobi/i.test(navigator.userAgent);
  const SAFARI = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const dropzone    = document.querySelector("html");
  const browse      = document.getElementById("browse");
  const play        = document.getElementById("play");
  const pause       = document.getElementById("pause");
  const stop        = document.getElementById("stop");
  const lactive     = document.getElementById("lactive");
  const ractive     = document.getElementById("ractive");
  const state       = document.getElementById("state");
  const background  = document.getElementById("background");
  const visual      = document.getElementById("visual");
  const channels    = document.getElementById("channels");
  const domains     = [document.getElementById("domain0"), document.getElementById("domain1")];
  const smooth      = document.getElementById("smooth");
  const tsmooth     = smooth.nextElementSibling;
  const fadespeed   = document.getElementById("fadespeed");
  const tfadespeed  = fadespeed.nextElementSibling;
  const midspace    = document.getElementById("midspace");
  const tmidspace   = midspace.nextElementSibling;
  const metermode   = document.getElementById("metermode");
  const tmetermode  = metermode.nextElementSibling;
  const meteralpha  = document.getElementById("meteralpha");
  const tmeteralpha = meteralpha.nextElementSibling;
  const foreground  = document.getElementById("foreimage");
  const columns     = document.getElementById("cols");
  const tcolumns    = columns.nextElementSibling;
  const colsize     = document.getElementById("colsize");
  const tcolsize    = colsize.nextElementSibling;
  const colspace    = document.getElementById("colspace");
  const tcolspace   = colspace.nextElementSibling;
  const rows        = document.getElementById("rows");
  const trows       = rows.nextElementSibling;
  const rowsize     = document.getElementById("rowsize");
  const trowsize    = rowsize.nextElementSibling;
  const rowspace    = document.getElementById("rowspace");
  const trowspace   = rowspace.nextElementSibling;
  const backmode    = document.getElementById("backmode");
  const backalpha   = document.getElementById("backalpha");
  const tbackalpha  = backalpha.nextElementSibling;
  const backgrad    = document.getElementById("backgrad");
  const tbackgrad   = backgrad.nextElementSibling;
  const backcolor   = document.getElementById("backcolor");
  const backabove   = document.getElementById("backabove");
  const backbeat    = document.getElementById("backbeat");
  const intensity   = document.getElementById("intensity");
  const tintensity  = intensity.nextElementSibling;
  const peaks       = document.getElementById("peaks");
  const peakdecay   = document.getElementById("peakdecay");
  const tpeakdecay  = peakdecay.nextElementSibling;
  const peakalpha   = document.getElementById("peakalpha");
  const tpeakalpha  = peakalpha.nextElementSibling;
  const meterdecay  = document.getElementById("meterdecay");
  const decaytime   = document.getElementById("decaytime");
  const tdecaytime  = decaytime.nextElementSibling;
  const fades       = document.getElementById("fades");
  const fadegrad    = document.getElementById("fadegrad");
  const tfadegrad   = fadegrad.nextElementSibling;
  const trails      = document.getElementById("trails");
  const trailalpha  = document.getElementById("trailalpha");
  const ttrailalpha = trailalpha.nextElementSibling;
  const l_grad      = document.getElementById("l_grad");
  const bl_grad     = l_grad.nextElementSibling;
  const l_color     = document.getElementById("l_color");
  const l_image     = document.getElementById("l_image");
  const r_grad      = document.getElementById("r_grad");
  const br_grad     = r_grad.nextElementSibling;
  const r_color     = document.getElementById("r_color");
  const r_image     = document.getElementById("r_image");

  let container = document.querySelector(".meters");

  const folder = window.neoart.Browser;
  const loader = window.neoart.FileLoader();
  const player = loader.player;
  const lmeter = window.neoart.Flectrum(container, 32, 64);
  const rmeter = window.neoart.Flectrum(container, 32, 64);

  let active = lmeter;
  let map = new Map();

  const backarray  = [active.backgroundGradient,
                     [0,"#c5deea",0.7,"#8abbd7",1,"#066dab"],
                     [0,"#bfd255",0.5,"#8eb92a",0.5,"#72aa00",1,"#9ecb2d"],
                     [0,"#f2825b",0.5,"#e55b2b",1,"#f07146"],
                     [0,"#fcfff4",1,"#e9e9ce"]
                   ];
  const fadearray  = [active.fadeGradient,
                     [0,"rgba(0,0,0,0)",0.5,"rgba(0,0,0,0.5)",1,"rgba(0,0,0,1)"],
                     [0,"rgba(0,0,0,0)",0.3,"rgba(0,0,0,1)",0.7,"rgba(0,0,0,1)",1,"rgba(0,0,0,0)"],
                     [0,"rgba(0,0,0,1)",0.5,"rgba(0,0,0,0.5)",1,"rgba(0,0,0,0)"]
                   ];
  const meterarray = [active.leftMeterGradient,
                     [0,"#bc9200",0.4,"#fff",0.6,"#fff",1,"#00005e"],
                     [0,"#00ffff",0.4,"#ffffc0",0.6,"#ffffc0",1,"#ff00ff"],
                     [0,"#fff",0.5,"#ddd",0.5,"#888",1,"#333"],
                     [0,"#ffff00",0.42,"#ff8540",0.76,"#ff0000",1,"#860000"]
                   ];

  function initialize() {
    var files = Array.from(document.querySelectorAll("input[type=file]"));

    files.forEach(function(ele) {
      ele.addEventListener("focus", function(e) {
        ele.parentElement.classList.add("focus");
      });

      ele.addEventListener("blur", function(e) {
        ele.parentElement.classList.remove("focus");
      });
    });

    const xhr = new XMLHttpRequest();
    xhr.open("get", document.body.getAttribute("data-module"));
    xhr.responseType = "arraybuffer";

    xhr.addEventListener("load", (e) => {
      if (loader.load(xhr.response)) {
        if (SAFARI) {
          play.disabled = false;
          play.focus();
        } else {
          player.play();
        }
      }
    });

    xhr.send(null);

    folder.callback = loadFile;

    lmeter.leftMeterImage  = rmeter.leftMeterImage  = document.getElementById("imgmet1");
    lmeter.rightMeterImage = rmeter.rightMeterImage = document.getElementById("imgmet2");
    lmeter.backgroundImage = rmeter.backgroundImage = document.getElementById("imgback");
    lmeter.foregroundImage = rmeter.foregroundImage = document.getElementById("imgfore");

    document.addEventListener("flodPlay",   flodPlay);
    document.addEventListener("flodPause",  flodPause);
    document.addEventListener("flodResume", flodPlay);
    document.addEventListener("flodStop",   flodStop);

    toggle(lactive, true);

    lmeter.channels = Channels.left;
    rmeter.channels = Channels.right;

    player.analyser = [lmeter, rmeter];
    player.loop = true;

    storage(lmeter);
    storage(rmeter);

    panels();
    setProperties();

    window.addEventListener("orientationchange", (e) => {
      if (playing) {
        player.pause();
        window.requestAnimatonFrame(function() { player.play(); });
      }
    });
  }

  function panels() {
    const nav = document.querySelector(".fapp header ul");

    let trans = "webkitTransitionEnd";

    if (nav.style["transition"] != "undefined") {
      trans = "transitionend";
    }

    nav.addEventListener("click", (e) => {
        const state = e.target;
        const id = state.getAttribute("data-id");

        if (id) {
          const panel = document.getElementById(id);
          const inner = panel.firstElementChild;

          const end = () => {
            panel.removeEventListener(trans, end);
            panel.removeAttribute("style");
          }

          panel.style.height = inner.offsetHeight +"px";

          if (panel.className) {
            panel.addEventListener(trans, end);

            state.removeAttribute("class");
            panel.removeAttribute("class");
          } else {
            state.className = "down";

            setTimeout(() => {
              panel.className = "collapsed";
            }, 50);
          }
        }

        e.preventDefault();
        e.stopPropagation();
    });
  }

  dropzone.addEventListener("dragover", (e) => {
    e.stopPropagation();
    e.preventDefault();
  });

  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[e.dataTransfer.files.length - 1];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => { loadFile(e.target.result, file.name); }
      reader.readAsArrayBuffer(file);
    }

    e.stopPropagation();
    e.preventDefault();
  });

  browse.addEventListener("click", (e) => {
    folder.open();
    e.preventDefault();
  });

  play.addEventListener("click", (e) => {
    player.play();
    e.preventDefault();
  });

  pause.addEventListener("click", (e) => {
    player.pause();
    e.preventDefault();
  });

  stop.addEventListener("click", (e) => {
    player.stop();
    e.preventDefault();
  });

  lactive.addEventListener("click", activateLeft);
  ractive.addEventListener("click", activateRight);

  state.addEventListener("change", (e) => {
    if (state.checked) {
      rmeter.append();
      player.analyser = [lmeter, rmeter];
    } else {
      rmeter.remove();
      player.analyser = [lmeter];
      setLeft();
    }
  });

  background.addEventListener("change", (e) => {
    active.background = background.checked;
  });

  visual.addEventListener("change", (e) => {
    active.visual = visual.selectedIndex;
  });

  channels.addEventListener("change", (e) => {
    active.channels = channels.selectedIndex;
  });

  domains[0].addEventListener("change", (e) => {
    active.dataDomain = Domain.frequency;
  });

  domains[1].addEventListener("change", (e) => {
    active.dataDomain = Domain.time;
  });

  smooth.addEventListener("input", (e) => {
    active.smoothingTime = smooth.value;
    tsmooth.innerText = Number(smooth.value).toFixed(1);
  });

  fadespeed.addEventListener("input", (e) => {
    active.stopSpeed = fadespeed.value;
    tfadespeed.innerText = fadespeed.value;
  });

  midspace.addEventListener("input", (e) => {
    active.middleSpacing = midspace.value;
    tmidspace.innerText = midspace.value;
  });

  metermode.addEventListener("change", (e) => {
    active.meterMode = metermode.selectedIndex;
  });

  meteralpha.addEventListener("input", (e) => {
    active.meterOpacity = meteralpha.value;
    tmeteralpha.innerText = Number(meteralpha.value).toFixed(1);
  });

  foreground.addEventListener("change", (e) => {
    loadImage(e.target.files[0], "foregroundImage");
    foreground.value = "";
  });

  columns.addEventListener("input", (e) => {
    active.columns = columns.value;
    tcolumns.innerText = columns.value;
  });

  colsize.addEventListener("input", (e) => {
    active.columnWidth = colsize.value;
    tcolsize.innerText = colsize.value;
  });

  colspace.addEventListener("input", (e) => {
    active.columnSpacing = colspace.value;
    tcolspace.innerText = colspace.value;
  });

  rows.addEventListener("input", (e) => {
    active.rows = rows.value;
    trows.innerText = rows.value;
  });

  rowsize.addEventListener("input", (e) => {
    active.rowHeight = rowsize.value;
    trowsize.innerText = rowsize.value;
  });

  rowspace.addEventListener("input", (e) => {
    active.rowSpacing = rowspace.value;
    trowspace.innerText = rowspace.value;
  });

  backmode.addEventListener("change", (e) => {
    active.backgroundMode = backmode.selectedIndex;
  });

  backalpha.addEventListener("input", (e) => {
    active.backgroundOpacity = backalpha.value;
    tbackalpha.innerText = Number(backalpha.value).toFixed(1);
  });

  backgrad.addEventListener("input", (e) => {
    map.get(active).backindex = backgrad.value;
    active.backgroundGradient = backarray[backgrad.value];
    drawGradient(tbackgrad, active.backgroundGradient);
  });

  backcolor.addEventListener("change", (e) => {
    active.backgroundColor = backcolor.value;
  });

  backimage.addEventListener("change", (e) => {
    loadImage(e.target.files[0], "backgroundImage");
    backimage.value = "";
  });

  backabove.addEventListener("change", (e) => {
    active.backgroundAbove = backabove.checked;
  });

  backbeat.addEventListener("change", (e) => {
    active.backgroundBeat = backbeat.checked;
  });

  intensity.addEventListener("input", (e) => {
    active.beatIntensity = intensity.value;
    tintensity.innerText = Number(intensity.value).toFixed(1);
  });

  peaks.addEventListener("change", (e) => {
    active.peaks = peaks.checked;
  });

  peakdecay.addEventListener("input", (e) => {
    active.peakDecay = peakdecay.value;
    tpeakdecay.innerText = Number(peakdecay.value).toFixed(2);
  });

  peakalpha.addEventListener("input", (e) => {
    active.peakOpacity = peakalpha.value;
    tpeakalpha.innerText = Number(peakalpha.value).toFixed(1);
  });

  meterdecay.addEventListener("change", (e) => {
    active.decay = meterdecay.checked;
  });

  decaytime.addEventListener("input", (e) => {
    active.meterDecay = decaytime.value;
    tdecaytime.innerText = Number(decaytime.value).toFixed(2);
  });

  fades.addEventListener("change", (e) => {
    active.fades = fades.checked;
  });

  fadegrad.addEventListener("input", (e) => {
    map.get(active).fadeindex = fadegrad.value;
    active.fadeGradient = fadearray[fadegrad.value];
    drawGradient(tfadegrad, active.fadeGradient);
  });

  trails.addEventListener("change", (e) => {
    active.trails = trails.checked;
  });

  trailalpha.addEventListener("input", (e) => {
    active.trailOpacity = trailalpha.value;
    ttrailalpha.innerText = Number(trailalpha.value).toFixed(1);
  });

  l_grad.addEventListener("input", (e) => {
    map.get(active).leftindex = l_grad.value;
    active.leftMeterGradient = meterarray[l_grad.value];
    drawGradient(bl_grad, active.leftMeterGradient);
  });

  l_color.addEventListener("change", (e) => {
    active.leftMeterColor = l_color.value;
  });

  l_image.addEventListener("change", (e) => {
    loadImage(e.target.files[0], "leftMeterImage");
    l_image.value = "";
  });

  r_grad.addEventListener("input", (e) => {
    map.get(active).rightindex = r_grad.value;
    active.rightMeterGradient = meterarray[r_grad.value];
    drawGradient(br_grad, active.rightMeterGradient);
  });

  r_color.addEventListener("change", (e) => {
    active.rightMeterColor = r_color.value;
  });

  r_image.addEventListener("change", (e) => {
    loadImage(e.target.files[0], "rightMeterImage");
    r_image.value = "";
  });

  function flodPlay() {
    play.disabled  = true;
    pause.disabled = false;
    stop.disabled  = false;
    pause.removeAttribute("class");
  }

  function flodPause() {
    play.disabled = false;
    pause.className = "down";
  }

  function flodStop() {
    play.disabled  = false;
    pause.disabled = true;
    stop.disabled  = true;
    pause.removeAttribute("class");
  }

  function loadFile(buffer, name) {
    if (loader.load(buffer)) {
      if (SAFARI) {
        play.disabled = false;
        play.focus();
      } else {
        player.play();
      }
    }
  }

  function activateLeft(e) {
    if (active != lmeter) {
      toggle(lactive, true);
      toggle(ractive, false);

      active = lmeter;
      setProperties();
    }
  }

  function activateRight(e) {
    if (active != rmeter) {
      toggle(lactive, false);
      toggle(ractive, true);

      active = rmeter;
      setProperties();
    }
  }

  function drawGradient(canvas, value) {
    const b = canvas.getContext("2d");
    const g = b.createLinearGradient(canvas.width, 0, 0, 0);

    for (let i = 0, len = value.length; i < len; i++) {
      g.addColorStop(value[i], value[++i]);
    }

    b.clearRect(0, 0, canvas.width, canvas.height);
    b.fillStyle = g;
    b.fillRect(0, 0, canvas.width, canvas.height);
  }

  function loadImage(file, property) {
    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      const img = new Image();
      img.src = e.target.result;
      active[property] = img;
    });

    reader.readAsDataURL(file);
  }

  function setProperties() {
    const props = map.get(active);

    if (active == lmeter) {
      state.checked = false;
      state.disabled = true;
    } else {
      state.checked = props.enabled;
      state.disabled = false;
    }

    background.checked = active.background;
    visual.selectedIndex = active.visual;
    channels.selectedIndex = active.channels;
    domains[active.dataDomain].checked = true;
    smooth.value = active.smoothingTime;
    tsmooth.innerText = Number(active.smoothingTime).toFixed(1);
    fadespeed.value = active.stopSpeed;
    tfadespeed.innerText = active.stopSpeed;

    metermode.selectedIndex = active.meterMode;
    meteralpha.value = active.meterOpacity;
    tmeteralpha.innerText = Number(active.meterOpacity).toFixed(1);

    columns.value = active.columns;
    tcolumns.innerText = active.columns;
    colsize.value = active.columnWidth;
    tcolsize.innerText = active.columnWidth;
    colspace.value = active.columnSpacing;
    tcolspace.innerText = active.columnSpacing;

    rows.value = active.rows;
    trows.innerText = active.rows;
    rowsize.value = active.rowHeight;
    trowsize.innerText = active.rowHeight;
    rowspace.value = active.rowSpacing;
    trowspace.innerText = active.rowSpacing;

    backmode.selectedIndex = active.backgroundMode;
    backalpha.value = active.backgroundOpacity;
    tbackalpha.innerText = Number(active.backgroundOpacity).toFixed(1);
    backgrad.value = props.backindex;
    backcolor.value = active.backgroundColor;
    backabove.checked = active.backgroundAbove;
    backbeat.checked = active.backgroundBeat;
    intensity.value = active.beatIntensity;
    tintensity.innerText = Number(active.beatIntensity).toFixed(1);

    peaks.checked = active.peaks;
    peakdecay.value = active.peakDecay;
    tpeakdecay.innerText = Number(active.peakDecay).toFixed(2);
    peakalpha.value = active.peakOpacity;
    tpeakalpha.innerText = Number(active.peakOpacity).toFixed(1);

    meterdecay.checked = active.decay;
    decaytime.value = active.meterDecay;
    tdecaytime.innerText = Number(active.meterDecay).toFixed(2);
    fades.checked = active.fades;
    fadegrad.value = props.fadeindex;
    trails.checked = active.trails;
    trailalpha.value = active.trailOpacity;
    ttrailalpha.innerText = Number(active.trailOpacity).toFixed(1);

    l_grad.value = props.leftindex;
    l_color.value = active.leftMeterColor;
    r_grad.value = props.rightindex;
    r_color.value = active.rightMeterColor;

    drawGradient(tbackgrad, backarray[props.backindex]);
    drawGradient(tfadegrad, fadearray[props.fadeindex]);
    drawGradient(bl_grad, meterarray[props.leftindex]);
    drawGradient(br_grad, meterarray[props.rightindex]);
  }

  function storage(instance) {
    const props = {
      enabled:    true,
      backindex:  0,
      fadeindex:  0,
      leftindex:  0,
      rightindex: 0
    };

    map.set(instance, props);
  }

  function toggle(ele, value) {
    if (value) {
      ele.setAttribute("data-up", ele.innerText);
      ele.className = "down";

      if (ele.hasAttribute("data-down")) {
        ele.innerText = ele.getAttribute("data-down");
      }
    } else {
      ele.removeAttribute("class");

      if (ele.hasAttribute("data-up")) {
        ele.innerText = ele.getAttribute("data-up");
        ele.removeAttribute("data-up");
      }
    }
  }

  initialize();
});