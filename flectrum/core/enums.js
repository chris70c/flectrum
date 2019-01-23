const BackgroundMode = Object.freeze(Object.create(null, {
  "0": { value:"clone"    }, clone   : { value:0, enumerable:true },
  "1": { value:"gradient" }, gradient: { value:1, enumerable:true },
  "2": { value:"color"    }, color   : { value:2, enumerable:true },
  "3": { value:"image"    }, image   : { value:3, enumerable:true }
}));

const Channels = Object.freeze(Object.create(null, {
  "0": { value:"both"   }, both  : { value:0, enumerable:true },
  "1": { value:"left"   }, left  : { value:1, enumerable:true },
  "2": { value:"right"  }, right : { value:2, enumerable:true },
  "3": { value:"stereo" }, stereo: { value:3, enumerable:true }
}));

const Domain = Object.freeze(Object.create(null, {
  "0": { value:"frequency" }, frequency: { value:0, enumerable:true },
  "1": { value:"time"      }, time     : { value:1, enumerable:true }
}));

const MeterMode = Object.freeze(Object.create(null, {
  "0": { value:"gradient"   }, gradient  : { value:0, enumerable:true },
  "1": { value:"image"      }, image     : { value:1, enumerable:true },
  "2": { value:"color"      }, color     : { value:2, enumerable:true },
  "3": { value:"foreground" }, foreground: { value:3, enumerable:true }
}));

const Visual = Object.freeze(Object.create(null, {
  "0": { value:"basic"   }, basic  : { value:0, enumerable:true },
  "1": { value:"split"   }, split  : { value:1, enumerable:true },
  "2": { value:"stripe"  }, stripe : { value:2, enumerable:true },
  "3": { value:"inward"  }, inward : { value:3, enumerable:true },
  "4": { value:"outward" }, outward: { value:4, enumerable:true }
}));