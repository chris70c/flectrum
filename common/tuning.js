  const PERIODS = new Int16Array(1024);

  function periods(format, version = 0) {
    var t = PERIODS;
    var i, j, r, x, y;

    switch (format) {
      case "chiptracker":
        base(36);

        for (i = 36; i < 48; i++) {
          r = t[i];
          t[i-36] = r * 8;
          t[i-24] = r * 4;
          t[i-12] = r * 2;
        }
        break;
      case "delta":
        base(37);
        t[48]--;
        t.fill(113, 73, 85);

        for (i = 37; i < 49; i++) {
          r = t[i];
          t[i - 36] = r * 8;
          t[i - 24] = r * 4;
          t[i - 12] = r * 2;
        }

        if (version == 1) {
          t.copyWithin(34, 35, 73);
          t[84] = 0;
        }
        break;
      case "fasttracker":
        base(12, 5, true);
        x = 0;
        y = 488;

        for (i = 0; i < 8; i++) {
          for (j = 0; j < 12; j++) {
            t[x] = t[x + 12] * 2;
            t[y] = t[y + 12] * 2;
            t[x + 48] = t[++x + 35] >> 1;
            t[y + 48] = t[++y + 35] >> 1;
          }

          x += 49;
          y += 49;
        }
        break;
      case "jhippel":
      case "futcomp":
        base(12);
        t.fill(113, 48, 60);

        for (i = 12; i < 24; i++) {
          r = t[i];
          t[i - 12] = r * 2;
          t[i + 48] = r * 4;
          t[i + 60] = r * 8;
        }

        if (version == 14) {
          t.copyWithin(72, 0, 60);
        }
        break;
      case "protracker":
        base(0, 3, true);
        break;
      case "soundfx":
        base(4);
        t[66] = -1;
        t.fill(113, 40, 66);

        for (i = 12; i < 16; i++) {
          r = t[i];
          t[i - 12] = r * 2;
        }
        break;
      case "soundmon":
        base(36);
        t[38] -= 2;
        t[40] += 2;
        t[43] += 2;
        t[44] += 2;
        t[47]--;

        for (i = 36; i < 48; i++) {
          r = t[i]
          t[i-36] = r * 8;
          t[i-24] = r * 4;
          t[i-12] = r * 2;
          t[i+12] = Math.ceil(r / 2);
          t[i+24] = Math.ceil(r / 4);
          t[i+36] = Math.ceil(r / 8);
        }
        break;
      default:
        base();
        break;
    }
  }

  function base(o = 0, octaves = 3, fine = false) {
    const ratio = 0.99888005173;
    const semi  = 0.94387431268;
    const tune  = 0.99280572049;

    var t = PERIODS;
    var n = 856;
    var r = n * ratio;
    var s = (octaves * 12) + 1;
    var x = o;
    var y = o + (s * 8);
    var l = (fine) ? 8 : 1;
    var i, j;

    t.fill(0);

    for (i = 0; i < l; i++) {
      for (j = 0; j < 36; j++) {
        t[x++] = t[++y] = r + 0.5;
        r *= semi;
      }

      t[y - 36] = (n / semi) + 0.5;
      t[x++] = 0;
      t[y++] = 0;

      x += (o * 2);
      y += (o * 2);
      r = (n *= tune);
    }

    l = o + 9;
    y = o + (s * 8) + 1;

    for (x = o; x < l; x++, y++) {
      t[x] = t[x + 12] * 2;
      t[y] = t[y + 12] * 2;
    }

    if (fine) {
      t[o +  s       +  4]--;
      t[o +  s       + 22]++;
      t[o +  s       + 24]++;
      t[o + (s *  2) + 23]++;
      t[o + (s *  4) +  9]++;
      t[o + (s *  7) + 24]++;
      t[o + (s *  9) +  6]--;
      t[o + (s *  9) + 26]--;
      t[o + (s * 12) + 34]--;
    } else {
      t.fill(0, o + s);
    }
  }