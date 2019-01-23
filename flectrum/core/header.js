(function() {
"use strict";

  if (!window.neoart) {
    window.neoart = Object.create(null);
  }

  if (!window.neoart.audioContext) {
    if (typeof AudioContext === "undefined") {
      window.neoart.audioContext = new webkitAudioContext();
    } else {
      window.neoart.audioContext = new AudioContext();
    }
  }

  window.neoart.Flectrum = function(node, cols_no = 32, rows_no = 64) {
    if (!(node instanceof HTMLElement)) { return false; }