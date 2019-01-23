  function merge(s1, s2) {
    var res = new Int8Array(s1.length + s2.length);
    res.set(new Int8Array(s1.buffer));
    res.set(new Int8Array(s2.buffer), s1.length);
    return new ByteArray(res.buffer);
  }