  function range(value, min = 0.0, max = 1.0) {
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }

    return value;
  }