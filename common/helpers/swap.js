  function swap(value) {
    return ((value > 16) & 0xffff) | ((value & 0xffff) << 16);
  }