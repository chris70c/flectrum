(function() {
"use strict";

  const path = [];
  const wait = 600;

  const xhrp = new XMLHttpRequest();
  const xhrf = new XMLHttpRequest();

  let callback = null;
  let current  = null;
  let time     = 0;

  let context = null;
  let file    = null;
  let back    = null;
  let list    = null;
  let load    = null;
  let cancel  = null;

  function getContent() {
    let data = new FormData();
    data.append("path", path.join("/"));

    context.classList.add("wait");

    xhrp.open("POST", "browser/browser.php", true);
    xhrp.send(data);
  }

  function openFile() {
    if (current) {
      let tag = current.parentElement.tagName.toLowerCase();
      context.classList.add("wait");

      if (tag == "b") {
        path.push(current.innerText.trim());
        getContent();
      } else {
        if (callback) {
          let url = file.innerText.trim();

          if (url) {
            context.classList.add("wait");
            url = "browser/browser.php?file="+ encodeURIComponent(path.join("/") +"/"+ url);

            xhrf.open("GET", url, true);
            xhrf.send(null);
          }
        }
      }
    }
  }

  function initialize() {
    context = document.getElementById("browser");
    file    = document.getElementById("filename");
    back    = context.querySelector("figure");
    list    = context.querySelector("article");
    load    = context.querySelector("button");
    cancel  = context.querySelectorAll("button")[1];

    path.push(context.getAttribute("data-path"));

    back.addEventListener("click", (e) => {
      if (path.length > 1) {
        path.pop();
        getContent();
      }

      e.stopPropagation();
      e.preventDefault();
    });

    list.addEventListener("click", (e) => {
      let ele = e.target;
      let tag = ele.tagName.toLowerCase();

      if (tag == "figure") {
        tag = ele.parentElement.tagName.toLowerCase();

        let temp = time;
        time = window.performance.now();
        temp = time - temp;

        if (ele == current) {
          if (temp < wait) {
            openFile();
          }
        } else {
          if (current) {
            current.classList.remove("selected");
          }

          if (tag != "b") {
            file.innerText = ele.innerText.trim();
          }

          ele.classList.add("selected");
          current = ele;
        }
      }

      e.stopPropagation();
      e.preventDefault();
    });

    load.addEventListener("click", openFile);

    cancel.addEventListener("click", (e) => {
      document.body.removeAttribute("style");
      context.removeAttribute("style");
    });

    xhrf.onload = (e) => {
      document.body.removeAttribute("style");
      context.classList.remove("wait");
      context.removeAttribute("style");

      callback(xhrf.response, file.innerText.trim());
    }

    xhrp.onload = (e) => {
      file.innerText = "";
      list.innerHTML = xhrp.responseText;

      context.classList.remove("wait");

      if (path.length > 1) {
        context.classList.add("show");
      } else {
        context.classList.remove("show");
      }
    }

    xhrf.responseType = "arraybuffer";
  }

  class Browser {
    get callback() {
      return callback;
    };

    set callback(value) {
      if (typeof value === "function") {
        callback = value;
      }
    };

    open() {
      if (!context) {
        initialize();
      }

      document.body.style.overflow = "hidden";
      context.style.display = "block";
      getContent();
    };
  }

  if (!window.neoart) {
    window.neoart = Object.create(null);
  }

  window.neoart.Browser = new Browser();
})();