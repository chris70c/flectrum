/*
  ByteArray 2.2
  Christian Corti
  NEOART Costa Rica
*/
class ByteArray extends DataView {
  constructor(buffer, endian, offset, length) {
    if (Number.isInteger(buffer)) {
      buffer = new ArrayBuffer(buffer);
    }

    if (!offset) { offset = 0; }
    if (!length) { length = buffer.byteLength; }

    super(buffer, offset, length);

    this.endian = endian & true;
    this.length = this.byteLength;
    this.position = 0;
  };

  get bytesAvailable() { return this.length - this.position; };

  get ubyte() {
    return this.getUint8(this.position++);
  };
  get byte() {
    return this.getInt8(this.position++);
  };
  set byte(value) {
    this.setInt8(this.position++, value);
  };

  get ushort() {
    var v = this.getUint16(this.position, this.endian);
    this.position += 2;
    return v;
  };
  get short() {
    var v = this.getInt16(this.position, this.endian);
    this.position += 2;
    return v;
  };
  set short(value) {
    this.setInt16(this.position, value, this.endian);
    this.position += 2;
  };

  get uint() {
    var v = this.getUint32(this.position, this.endian);
    this.position += 4;
    return v;
  };
  get int() {
    var v = this.getInt32(this.position, this.endian);
    this.position += 4;
    return v;
  };
  set int(value) {
    this.setInt32(this.position, value, this.endian);
    this.position += 4;
  };

  readAt(index) {
    return this.getUint8(index);
  };

  readBytes(dest, offset, length) {
    var d = new Int8Array(dest.buffer, offset, length);
    var s = new Int8Array(this.buffer, this.position, length);
    d.set(s);
    this.position += length;
  };

  readUTF8(length) {
    var v = String.fromCharCode.apply(null, new Uint8Array(this.buffer, this.position, length));
    this.position += length;
    return v.replace(/\0/g, "");
  };

  writeAt(index, value) {
    this.setInt8(index, value);
  };

  writeBytes(source, offset, length) {
    var d = new Int8Array(this.buffer, this.position, length);
    var s = new Int8Array(source.buffer, offset, length);
    d.set(s);
    this.position += length;
  };

  writeUTF8(value) {
    for (var i = 0, l = value.length; i < l; i++) {
      this.setInt8(this.position++, value.charCodeAt(i));
    }
  };

  extend(length) {
    var r = new Int8Array(this.length + length);
    r.set(new Int8Array(this.buffer));
    return new ByteArray(r.buffer);
  };

  fill(value, offset = 0, length) {
    if (!length) { length = this.length - offset; }
    new Int8Array(this.buffer, offset, length).fill(value);
  };

  shrink(offset, length) {
    length -= offset;
    var r = new Int8Array(this.buffer, offset, length);
    var w = new Int8Array(length);
    w.set(r);
    return new ByteArray(w.buffer);
  };
}