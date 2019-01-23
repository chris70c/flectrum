function save(buffer, parent, filename = "File.bin", text = "Download file.") {
  var a = document.createElement("a");
  var b = new Blob([buffer], {type:"application/octet-stream"});

  if (!parent) { parent = document.body; }

  a.download = filename;
  a.href = window.URL.createObjectURL(b);
  a.innerText = text;
  parent.appendChild(a);
}