    function reset() {
      if (destination) {
        if (splitter) {
          destination.disconnect(splitter);
        } else if (analyser1) {
          destination.disconnect(analyser1);
        }
      } else if (instances.has(composer)) {
        instances.delete(composer);
      }

      fldata.fill(0);
      frdata.fill(0);

      analyser1 = null;
      analyser2 = null;
      splitter  = null;
    }

    function invalidate(bits) {
      state |= bits;

      if (!invalid) {
        invalid = 1;
        window.requestAnimationFrame(validate);
      }
    }

    function validate(e) {
      if (state & BitSize) { composer.resize(); }

      if (state & BitMeter) {
        composer.visual.setup();

        if (backMode == BackgroundMode.clone) {
          composer.createBackground();
          state ^= BitGround;
        }
      }

      if (state & BitGround) { composer.createBackground(); }

      if (state & BitFader) { composer.createMask(); }

      if (state & BitChannel) { composer.createChannels(); }

      invalid = state = 0;
    }

    const Classes = {
      "0": Basic,
      "1": Split,
      "2": Stripe,
      "3": Inward,
      "4": Outward
    };

    const BitSize    = 1;
    const BitMeter   = 2;
    const BitGround  = 4;
    const BitFader   = 8;
    const BitChannel = 16;
    const BitCombo1  = 7;
    const BitCombo2  = 15;

    var background    = true;
    var backBeat      = false;
    var backColor     = "#000000";
    var backGradient  = [0.0,"#fceabb",0.5,"#fccd4d",0.5,"#f8b500",1.0,"#fbdf93"];
    var backImage     = null;
    var backMode      = BackgroundMode.clone;
    var backOpacity   = 0.2;
    var beatIntensity = 0.7;
    var channels      = Channels.both;
    var cols          = cols_no;
    var colWidth      = 10;
    var colSpacing    = 1;
    var dataDomain    = Domain.frequency;
    var decay         = true;
    var fades         = false;
    var fadeGradient  = [0.0,"rgba(0,0,0,0)",0.065,"rgba(0,0,0,0.5)",0.13,"rgba(0,0,0,1.0)"];
    var foreImage     = null;
    var meterColor    = ["#50d020","#50d020"];
    var meterDecay    = 0.08;
    var meterGradient = [[0.039,"#ff3939",0.235,"#ffb320",0.431,"#fff820",0.941,"#50d020"], [0.039,"#ff3939",0.235,"#ffb320",0.431,"#fff820",0.941,"#50d020"]];
    var meterImage    = [null, null];
    var meterMode     = MeterMode.gradient;
    var meterOpacity  = 1.0;
    var midSpacing    = 0;
    var peaks         = true;
    var peakDecay     = 0.02;
    var peakOpacity   = 1.0;
    var rows          = rows_no;
    var rowHeight     = 3;
    var rowSpacing    = 1;
    var smoothTime    = 0.0;
    var stopSpeed     = 1;
    var trails        = false;
    var trailOpacity  = 0.7;
    var visual        = Visual.basic;

    var audio = window.neoart.audioContext;
    var analyser1;
    var analyser2;
    var destination;
    var splitter;

    var aldata, ardata;
    var fldata, frdata;
    var cldata, crdata;
    var pldata, prdata;

    var alphas  = ["rgba(0,0,0,1.0)", "rgba(0,0,0,1.0)"];
    var colSize = 0;
    var freqBin = 0;
    var height  = 0;
    var invalid = 0;
    var level   = 0;
    var parent  = node;
    var remains = 0;
    var restore = 0.0;
    var rowSize = 0;
    var state   = 0;
    var width   = 0;

    var ground = document.createElement("canvas").getContext("2d", false);
    var bitmap = document.createElement("canvas").getContext("2d", false);
    var buffer = document.createElement("canvas").getContext("2d", false);
    var masker = document.createElement("canvas").getContext("2d", false);
    var faders = document.createElement("canvas").getContext("2d", false);
    var screen = document.createElement("canvas").getContext("2d", false);

    var container = document.createElement("div");

    var composer = new Composer();
    invalidate(BitCombo2);

    node.appendChild(container);
    return Object.seal(new Flectrum());
  }