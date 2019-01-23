  function isColor(value) {
    var span = document.createElement("span");
    span.style.color = value;
    return span.style.color.trim() !== "";
  }