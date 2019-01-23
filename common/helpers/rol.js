  function rol(value, shift) {
    return (value << shift) | (value >>> (32 - shift));
  }

  function rol8(value, shift) {
    const rotation = shift & 7;

    return ((value << rotation) & 255) | (value >>> (8 - rotation));
  }