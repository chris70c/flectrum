  function isNumeric(value) {
    value = parseFloat(value);
    return !Number.isNaN(value) && isFinite(value);
  }