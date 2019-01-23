/*
  Flip 1.4
  Christian Corti
  NEOART Costa Rica
*/
const Flip = (function() {
  const ERROR1  = "The archive is either in unknown format or damaged.";
  const ERROR2  = "Unexpected end of archive.";
  const ERROR3  = "Encrypted archive not supported.";
  const ERROR4  = "Compression method not supported.";
  const ERROR5  = "Invalid block type.";
  const ERROR6  = "Available inflate data did not terminate.";
  const ERROR7  = "Invalid literal/length or distance code.";
  const ERROR8  = "Distance is too far back.";
  const ERROR9  = "Stored block length did not match one's complement.";
  const ERROR10 = "Too many length or distance codes.";
  const ERROR11 = "Code lengths codes incomplete.";
  const ERROR12 = "Repeat lengths with no first length.";
  const ERROR13 = "Repeat more than specified lengths.";
  const ERROR14 = "Invalid literal/length code lengths.";
  const ERROR15 = "Invalid distance code lengths.";

  const LENG  = new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258]);
  const LEXT  = new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);
  const DIST  = new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577]);
  const DEXT  = new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);
  const ORDER = new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);

  class Huffman {
    constructor(length) {
      this.count  = new Uint16Array(length);
      this.symbol = new Uint16Array(length);
    };
  }

  class Inflater {
    constructor() {
      this.output = null;
      this.inpbuf = null;
      this.inpcnt = 0;
      this.bitbuf = 0;
      this.bitcnt = 0;

      this.initialize();
    };

    set input(args) {
      this.inpbuf = args[0];
      this.inpbuf.endian = args[2];
      this.inpbuf.position = 0;
      this.inpcnt = 0;

      this.output = new ByteArray(new ArrayBuffer(args[1]));
      this.output.endian = args[2];
      this.output.position = 0;
      this.outcnt = 0;
    };

    inflate() {
      var err, last, type;

      do {
        last = this.bits(1);
        type = this.bits(2);

        err = (type == 0) ? this.stored() :
              (type == 1) ? this.codes(this.flencode, this.fdiscode) :
              (type == 2) ? this.dynamic() : 1;

        if (err) { throw ERROR5; }
      } while (!last);
    };

    initialize() {
      var len = new Uint8Array(288);

      this.flencode = new Huffman(288);
      this.fdiscode = new Huffman(30);

      len.fill(8, 0, 144);
      len.fill(9, 144, 256);
      len.fill(7, 256, 280);
      len.fill(8, 280);
      this.construct(this.flencode, len, 288);

      len.fill(5, 0, 30);
      this.construct(this.fdiscode, len, 30);

      this.dlencode = new Huffman(286);
      this.ddiscode = new Huffman(30);
    };

    construct(huff, arr, n) {
      var left = 1, len = 1, off = new Uint16Array(16), sym = 0;

      huff.count.fill(0, 0, 16);
      for (; sym < n; sym++) { huff.count[arr[sym]]++; }
      if (huff.count[0] == n) { return 0; }

      for (; len < 16; len++) {
        left <<= 1;
        left -= huff.count[len];
        if (left < 0) { return left; }
      }

      for (len = 1; len < 15; len++) { off[len + 1] = off[len] + huff.count[len]; }

      for (sym = 0; sym < n; sym++) { if (arr[sym] != 0) { huff.symbol[off[arr[sym]]++] = sym; } }

      return left;
    };

    bits(need) {
      var buf = this.bitbuf, inplen = this.inpbuf.length;

      while (this.bitcnt < need) {
        if (this.inpcnt == inplen) { throw ERROR6; }
        buf |= this.inpbuf.readAt(this.inpcnt++) << this.bitcnt;
        this.bitcnt += 8;
      }

      this.bitbuf = buf >> need;
      this.bitcnt -= need;
      return buf & ((1 << need) - 1);
    };

    codes(lencode, discode) {
      var dis, len, pos, sym;

      do {
        sym = this.decode(lencode);

        if (sym < 256) {
          this.output.writeAt(this.outcnt++, sym);
        } else if (sym > 256) {
          sym -= 257;
          if (sym >= 29) { throw ERROR7; }
          len = LENG[sym] + this.bits(LEXT[sym]);

          sym = this.decode(discode);
          if (sym < 0) { return sym; }
          dis = DIST[sym] + this.bits(DEXT[sym]);
          if (dis > this.outcnt) { throw ERROR8; }

          pos = this.outcnt - dis;
          while (len--) { this.output.writeAt(this.outcnt++, this.output.readAt(pos++)); }
        }
      } while (sym != 256);

      return 0;
    };

    decode(huff) {
      var buf = this.bitbuf, code = 0, count, first = 0, index = 0, inplen = this.inpbuf.length, left = this.bitcnt, len = 1;

      while (1) {
        while (left--) {
          code |= buf & 1;
          buf >>= 1;
          count = huff.count[len];

          if ((code - count) < first) {
            this.bitbuf = buf;
            this.bitcnt = (this.bitcnt - len) & 7;
            return huff.symbol[index + (code - first)];
          }

          index += count;
          first += count;
          first <<= 1;
          code  <<= 1;
          len++;
        }

        left = 16 - len;
        if (!left) { break; }
        if (this.inpcnt == inplen) { throw ERROR6; }
        buf = this.inpbuf.readAt(this.inpcnt++);
        if (left > 8) { left = 8; }
      }

      throw ERROR7;
    };

    stored() {
      var inplen = this.inpbuf.length, len = 0;
      this.bitbuf = this.bitcnt = 0;

      if ((this.inpcnt + 4) > inplen) { throw ERROR6; }
      len  = this.inpbuf.readAt(this.inpcnt++);
      len |= this.inpbuf.readAt(this.inpcnt++) << 8;

      if (this.inpbuf.readAt(this.inpcnt++) != ( ~len & 0xff) ||
          this.inpbuf.readAt(this.inpcnt++) != ((~len >> 8) & 0xff)) { throw ERROR9; }

      if ((this.inpcnt + len) > inplen) { throw ERROR6; }
      while (len--) { this.output.writeAt(this.outcnt++, this.inpbuf.readAt(this.inpcnt++)); }

      return 0;
    };

    dynamic() {
      var arr = new Uint8Array(316), err, index = 0, len, nlen = this.bits(5) + 257, ndis = this.bits(5) + 1, ncode = this.bits(4) + 4, max = nlen + ndis, sym;

      if (nlen > 286 || ndis > 30) { throw ERROR10; }
      for (; index < ncode; ++index) { arr[ORDER[index]] = this.bits(3); }
      for (; index < 19; ++index) { arr[ORDER[index]] = 0; }

      err = this.construct(this.dlencode, arr, 19);
      if (err) { throw ERROR11; }
      index = 0;

      while (index < max) {
        sym = this.decode(this.dlencode);

        if (sym < 16) {
          arr[index++] = sym;
        } else {
          len = 0;

          if (sym == 16) {
            if (index == 0) { throw ERROR12; }
            len = arr[index - 1];
            sym = 3 + this.bits(2);
          } else if (sym == 17) {
            sym = 3 + this.bits(3);
          } else {
            sym = 11 + this.bits(7);
          }

          if ((index + sym) > max) { throw ERROR13; }
          while (sym--) { arr[index++] = len; }
        }
      }

      err = this.construct(this.dlencode, arr, nlen);
      if (err < 0 || (err > 0 && nlen - this.dlencode.count[0] != 1)) { throw ERROR14; }

      err = this.construct(this.ddiscode, arr.subarray(nlen), ndis);
      if (err < 0 || (err > 0 && ndis - this.ddiscode.count[0] != 1)) { throw ERROR15; }

      return this.codes(this.dlencode, this.ddiscode);
    };
  }

  class ZipEntry {
    constructor() {
      this.name       = "";
      this.extra      = null;
      this.version    = 0;
      this.flag       = 0;
      this.method     = 0;
      this.time       = 0;
      this.crc        = 0;
      this.compressed = 0;
      this.size       = 0;
      this.offset     = 0;
    };

    get date() {
      return new Date(
        ((this.time >> 25) & 0x7f) + 1980,
        ((this.time >> 21) & 0x0f) - 1,
         (this.time >> 16) & 0x1f,
         (this.time >> 11) & 0x1f,
         (this.time >>  5) & 0x3f,
         (this.time & 0x1f) << 1
      );
    };

    get isDirectory() {
      return (this.name.charAt(this.length - 1) == "/");
    };
  }

  return class Flip {
    constructor(stream) {
      if (!stream) { return null; }
      if (!(stream instanceof ByteArray)) { stream = new ByteArray(stream); }

      this.endian  = true;
      this.entries = null;
      this.stream  = stream;
      this.total   = 0;

      stream.endian = this.endian;
      stream.position = 0;

      this.parseEnd();
      return Object.seal(this);
    };

    about() {
      console.info("Flip 1.5\n2016/08/15\nChristian Corti\nNeoart Costa Rica");
    };

    uncompress(entry) {
      var src = this.stream, buffer, found = false, i, inflater, item, l, size;
      if (!entry) { return null; }

      if (typeof entry === "string") {
        for (i = 0, l = this.entries.length; i < l; i++) {
          item = this.entries[i];

          if (item.name == entry) {
            entry = item;
            found = true;
            break;
          }
        }

        if (!found) { return null; }
      }

      src.position = entry.offset + 28;
      size = src.ushort;
      src.position += (entry.name.length + size);

      if (entry.compressed) {
        buffer = new ByteArray(new ArrayBuffer(entry.compressed), this.endian);
        src.readBytes(buffer, 0, entry.compressed);

        switch (entry.method) {
          case 0:
            return buffer;
          case 8:
            inflater = new Inflater();
            inflater.input = [buffer, entry.size, this.endian];
            inflater.inflate();
            return inflater.output;
          default:
            throw ERROR4;
            break;
        }
      }
    };

    parseCentral() {
      var src = this.stream, entry, hdr = new ByteArray(new ArrayBuffer(46), this.endian), i, l, size;

      for (i = 0, l = this.entries.length; i < l; i++) {
        src.readBytes(hdr, 0, 46);
        hdr.position = 0;
        if (hdr.uint != 0x02014b50) { throw ERROR2; }
        hdr.position += 24;

        size = hdr.ushort;
        if (!size) { throw ERROR2; }
        entry = new ZipEntry();
        entry.name = src.readUTF8(size);

        size = hdr.ushort;
        if (size) {
          entry.extra = new ByteArray(new ArrayBuffer(size), this.endian);
          src.readBytes(entry.extra, 0, size);
        }

        src.position += hdr.ushort;
        hdr.position = 6;
        entry.version = hdr.ushort;

        entry.flag = hdr.ushort;
        if ((entry.flag & 1) == 1) { throw ERROR3; }

        entry.method = hdr.ushort;
        entry.time = hdr.uint;
        entry.crc = hdr.uint;
        entry.compressed = hdr.uint;
        entry.size = hdr.uint;
        this.total += entry.size;

        hdr.position = 42;
        entry.offset = hdr.uint;
        this.entries[i] = Object.freeze(entry);
      }
    };

    parseEnd() {
      var src = this.stream, i = src.length - 22, l = i - 65536;
      if (l < 0) { l = 0; }

      do {
        if (src.readAt(i) != 0x50) { continue; }
        src.position = i;
        if (src.uint == 0x06054b50) { break; }
      } while (--i > l);

      if (i == l) { throw ERROR1; }

      src.position = i + 10;
      this.entries = [];
      this.entries.length = src.ushort;

      src.position = i + 16;
      src.position = src.uint;
      this.parseCentral();
    };
  }
})();