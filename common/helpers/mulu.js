  function mulu(n, m) {
    n >>>= 0;
    m >>>= 0;
    var nlo = n & 0xffff;
    var nhi = n - nlo;
    return ((nhi & m >>> 0) + (nlo * m)) >>> 0;
  }