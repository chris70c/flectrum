    class Flectrum {
      get background() { return background; };
      set background(value) {
        if (value != background) {
          if (value) {
            container.insertBefore(ground.canvas, screen.canvas);
            background = true;
          } else {
            container.removeChild(ground.canvas);
            background = false;
          }
        }
      };

      get backgroundAbove() { return ground.canvas.style.zIndex != ""; };
      set backgroundAbove(value) {
        if (value) {
          ground.canvas.style.zIndex = 1;
        } else {
          ground.canvas.style.removeProperty("z-index");
        }
      };

      get backgroundBeat() { return backBeat; };
      set backgroundBeat(value) {
        if (value) {
          ground.canvas.style.willChange = "opacity";
          backBeat = true;
        } else {
          ground.canvas.style.removeProperty("will-change");
          backBeat = false;
        }
      };

      get backgroundColor() { return backColor; };
      set backgroundColor(value) {
        if (isColor(value)) {
          backColor = value;

          if (backMode == BackgroundMode.color) {
            invalidate(BitGround);
          }
        }
      };

      get backgroundGradient() { return backGradient; };
      set backgroundGradient(value) {
        if (Array.isArray(value)) {
          backGradient = value;

          if (backMode == BackgroundMode.gradient) {
            invalidate(BitGround);
          }
        }
      };

      get backgroundImage() { return backImage; };
      set backgroundImage(value) {
        if (isImage(value)) {
          backImage = value;

          if (backMode == BackgroundMode.image) {
            invalidate(BitGround);
          }
        }
      };

      get backgroundMode() { return backMode; };
      set backgroundMode(value) {
        if (value in BackgroundMode) {
          value = parseInt(value);

          if (value != backMode) {
            backMode = value;
            invalidate(BitGround);
          }
        }
      };

      get backgroundOpacity() { return backOpacity; };
      set backgroundOpacity(value) {
        if (isNumeric(value)) {
          backOpacity = range(value);
          ground.canvas.style.opacity = backOpacity;
        }
      };

      get beatIntensity() { return beatIntensity; };
      set beatIntensity(value) {
        if (isNumeric(value)) {
          beatIntensity = range(value);
        }
      };

      get channels() { return channels; };
      set channels(value) {
        if (value in Channels) {
          channels = parseInt(value);
          invalidate(BitChannel);
        }
      };

      get columns() { return cols; };
      set columns(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          value = range(value, 2, 256);

          if (value != cols) {
            cols = value;
            invalidate(BitCombo1);
          }
        }
      };

      get columnWidth() { return colWidth; };
      set columnWidth(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          value = range(value, 1, 50);

          if (value != colWidth) {
            colWidth = value;
            invalidate(BitCombo1);
          }
        }
      };

      get columnSpacing() { return colSpacing; };
      set columnSpacing(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          value = range(value, 0, 20);

          if (value != colSpacing) {
            colSpacing = value;
            invalidate(BitCombo1);
          }
        }
      };

      get dataDomain() { return dataDomain; };
      set dataDomain(value) {
        if (value in Domain) {
          dataDomain = parseInt(value);
        }
      };

      get decay() { return decay; };
      set decay(value) {
        decay = (value) ? true : false;
      };

      get fades() { return fades; };
      set fades(value) {
        fades = (value) ? true : false;
      };

      get fadeGradient() { return fadeGradient; };
      set fadeGradient(value) {
        if (Array.isArray(value)) {
          fadeGradient = value;
          invalidate(BitFader);
        }
      };

      get foregroundImage() { return foreImage; };
      set foregroundImage(value) {
        if (isImage(value)) {
          foreImage = value;

          if (meterMode == MeterMode.foreground) {
            invalidate(BitMeter);
          }
        }
      };

      get frameRate() { return frameRate; };
      set frameRate(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          frameRate = range(value, 1, 60);
          interval = 1000 / frameRate;
        }
      };

      get height() { return height; };

      get leftMeterColor() { return meterColor[0]; };
      set leftMeterColor(value) {
        if (isColor(value)) {
          meterColor[0] = value;

          if (meterMode == MeterMode.color) {
            invalidate(BitMeter);
          }
        }
      };

      get rightMeterColor() { return meterColor[1]; };
      set rightMeterColor(value) {
        if (isColor(value)) {
          meterColor[1] = value;

          if (meterMode == MeterMode.color) {
            invalidate(BitMeter);
          }
        }
      };

      get meterDecay() { return meterDecay; };
      set meterDecay(value) {
        if (isNumeric(value)) {
          meterDecay = range(value, 0.02, 0.20);
        }
      };

      get leftMeterGradient() { return meterGradient[0]; };
      set leftMeterGradient(value) {
        if (Array.isArray(value)) {
          meterGradient[0] = value;

          if (meterMode == MeterMode.gradient) {
            invalidate(BitMeter);
          }
        }
      };

      get rightMeterGradient() { return meterGradient[1]; };
      set rightMeterGradient(value) {
        if (Array.isArray(value)) {
          meterGradient[1] = value;

          if (meterMode == MeterMode.gradient) {
            invalidate(BitMeter);
          }
        }
      };

      get leftMeterImage() { return meterImage[0]; };
      set leftMeterImage(value) {
        if (isImage(value)) {
          meterImage[0] = value;

          if (meterMode == MeterMode.image) {
            invalidate(BitMeter);
          }
        }
      };

      get rightMeterImage() { return meterImage[1]; };
      set rightMeterImage(value) {
        if (isImage(value)) {
          meterImage[1] = value;

          if (meterMode == MeterMode.image) {
            invalidate(BitMeter);
          }
        }
      };

      get meterMode() { return meterMode; };
      set meterMode(value) {
        if (value in MeterMode) {
          value = parseInt(value);

          if (value != meterMode) {
            meterMode = value;
            invalidate(BitMeter);
          }
        }
      };

      get meterOpacity() { return meterOpacity; };
      set meterOpacity(value) {
        if (isNumeric(value)) {
          value = range(value);
          meterOpacity = value;
          alphas[0] = "rgba(0,0,0,"+ value +")";
        }
      };

      get middleSpacing() { return midSpacing; };
      set middleSpacing(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          value = range(value, 0, 20);

          if (value != midSpacing) {
            midSpacing = value;
            invalidate(BitCombo1);
          }
        }
      };

      get peaks() { return peaks; };
      set peaks(value) {
        peaks = (value) ? true : false;
      };

      get peakDecay() { return peakDecay; };
      set peakDecay(value) {
        if (isNumeric(value)) {
          peakDecay = range(value, 0.01, 0.10);
        }
      };

      get peakOpacity() { return peakOpacity; };
      set peakOpacity(value) {
        if (isNumeric(value)) {
          peakOpacity = range(value);
          alphas[1] = "rgba(0,0,0,"+ peakOpacity +")";
        }
      };

      get rows() { return rows; };
      set rows(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          value = range(value, 5, 255);

          if (value != rows) {
            rows = value;
            invalidate(BitCombo2);
          }
        }
      };

      get rowHeight() { return rowHeight; };
      set rowHeight(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          value = range(value, 1, 25);

          if (value != rowHeight) {
            rowHeight = value;
            invalidate(BitCombo2);
          }
        }
      };

      get rowSpacing() { return rowSpacing; };
      set rowSpacing(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          value = range(value, 0, 20);

          if (value != rowSpacing) {
            rowSpacing = value;
            invalidate(BitCombo2);
          }
        }
      };

      get smoothingTime() { return smoothTime; };
      set smoothingTime(value) {
        if (isNumeric(value)) {
          smoothTime = range(value);

          if (analyser1) { analyser1.smoothingTimeConstant = smoothTime; }
          if (analyser2) { analyser2.smoothingTimeConstant = smoothTime; }
        }
      };

      get stopSpeed() { return stopSpeed; };
      set stopSpeed(value) {
        value = parseInt(value);

        if (Number.isInteger(value)) {
          stopSpeed = value;
        }
      };

      get trails() { return trails; };
      set trails(value) {
        trails = (value) ? true : false;

        if (!trails) {
          screen.globalCompositeOperation = "copy";
        }
      };

      get trailOpacity() { return trailOpacity; };
      set trailOpacity(value) {
        if (isNumeric(value)) {
          trailOpacity = range(value, 0.1, 0.9);
        }
      };

      get visual() { return visual; };
      set visual(value) {
        if (value in Visual) {
          visual = parseInt(value);
          composer.visual = new Classes[value]();
          invalidate(BitMeter);
        }
      };

      get width() { return width; };

      about() {
        console.info("Flectrum 1.1\n2016/12/15\nChristian Corti\nNEOART Costa Rica");
      };

      append() {
        parent.appendChild(container);

        if (!instances.has(composer)) {
          instances.set(composer, true);
        }
      };

      connect(node) {
        if (node instanceof AudioNode) {
          destination = node;
          composer.createChannels();

          if (!instances.has(composer)) {
            instances.set(composer, true);
          }

          composer.processMode();

          if (!step_id) { step_id = window.requestAnimationFrame(step); }
        }

        return node;
      };

      disconnect() {
        composer.fadeMode();
        destination = null;
      };

      remove() {
        container.remove();
        instances.delete(composer);
      };

      setup(cols, colWidth, rows, rowHeight, midSpacing, visual, channels) {
        this.columns       = cols;
        this.columnWidth   = colWidth;
        this.rows          = rows;
        this.rowHeight     = rowHeight;
        this.middleSpacing = midSpacing;
        this.visual        = visual;
        this.channels      = channels;
      };
    }