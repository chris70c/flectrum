  function ror(value, shift) {
    return (value >> shift) | (value << (32 - shift));
  }