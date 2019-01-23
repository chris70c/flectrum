    class Composer {
      constructor() {
        this.visual = new Basic();

        faders.canvas.width = 2;

        ground.canvas.style.position =
        screen.canvas.style.position = "absolute";

        ground.canvas.style.margin
        screen.canvas.style.margin = 0;

        ground.canvas.style.opacity = backOpacity;

        container.style.position = "relative";
        container.style.textAlign = "left";

        container.appendChild(ground.canvas);
        container.appendChild(screen.canvas);
      };

      fade() {
        if (remains--) {
          if (!invalid) {
            this.visual.update();

            if (restore) {
              ground.canvas.style.opacity -= restore;
            }
          }
        } else {
          instances.delete(this);
          screen.clearRect(0,0,width,height);
          this.processMode();

          peakDecay /= stopSpeed;
          meterDecay /= stopSpeed;

          if (!instances.size) {
            window.cancelAnimationFrame(step_id);
            step_id = 0;
          }
        }
      };

      fadeMode() {
        if (this.update == this.process) {
          peakDecay *= stopSpeed;
          meterDecay *= stopSpeed;

          if (peaks) {
            remains = Math.ceil(1.0 / peakDecay);
          } else {
            remains = Math.ceil(1.0 / meterDecay);
          }

          restore = (ground.canvas.style.opacity - backOpacity) / remains;

          reset();
          this.update = this.fade;
        }
      };

      process() {
        if (!invalid) {
          if (dataDomain == Domain.time) {
            this.sampleTime();
          } else {
            this.sampleFrequency();
          }

          this.visual.update();

          if (backBeat) {
            ground.canvas.style.opacity = level * beatIntensity;
          }
        }
      };

      processMode() {
        this.update = this.process;
      };

      createBackground() {
        switch (backMode) {
          case BackgroundMode.gradient:
            let data = backGradient;
            let grad = ground.createLinearGradient(0,0,0,height);
            let i = 0;
            let l = data.length;

            for (; i < l; i++) {
              grad.addColorStop(data[i], data[++i]);
            }

            ground.fillStyle = grad;
            ground.fillRect(0,0,width,height);
            break;
          case BackgroundMode.color:
            ground.fillStyle = backColor;
            ground.fillRect(0,0,width,height);
            break;
          case BackgroundMode.image:
            if (backImage) {
              ground.drawImage(backImage, 0,0,backImage.width,backImage.height, 0,0,width,height);
            }
            break;
          default:
            ground.drawImage(bitmap.canvas,0,0);
            break;
        }
      };

      createChannels() {
        if (destination) {
          reset();

          analyser1 = audio.createAnalyser();
          analyser1.fftSize = freqBin;
          analyser1.smoothingTimeConstant = smoothTime;

          if (channels == Channels.stereo) {
            destination.connect(analyser1);
          } else {
            splitter = audio.createChannelSplitter(2);

            switch (channels) {
              case Channels.left:
                splitter.connect(analyser1,0,0);
                break;
              case Channels.right:
                splitter.connect(analyser1,1,0);
                break;
              default:
                analyser1.fftSize = freqBin >> 1;

                analyser2 = audio.createAnalyser();
                analyser2.fftSize = freqBin >> 1;
                analyser2.smoothingTimeConstant = smoothTime;

                splitter.connect(analyser1,0,0);
                splitter.connect(analyser2,1,0);
                break;
            }

            destination.connect(splitter);
          }
        }
      };

      createData() {
        var cols = this.visual.cols;

        freqBin = Math.pow(2, Math.round(Math.log(cols) / Math.log(2))) * 16;

        if (analyser2) {
          analyser1.fftSize = freqBin >> 1;
          analyser2.fftSize = freqBin >> 1;
        } else if (analyser1) {
          analyser1.fftSize = freqBin;
        }

        aldata = new Uint8Array(freqBin);
        ardata = new Uint8Array(freqBin);

        fldata = new Float32Array(cols);
        frdata = new Float32Array(cols);
        cldata = new Float32Array(cols);
        crdata = new Float32Array(cols);
        pldata = new Float32Array(cols);
        prdata = new Float32Array(cols);
      };

      createMask() {
        var tb = faders.createLinearGradient(0,0,0,height);
        var bt = faders.createLinearGradient(0,height,0,0);
        var i = 0;
        var l = fadeGradient.length;
        var color, stop;

        for (; i < l; i++) {
          stop = fadeGradient[i];
          color = fadeGradient[++i];

          tb.addColorStop(stop, color);
          bt.addColorStop(stop, color);
        }

        faders.clearRect(0,0,width,height);
        faders.fillStyle = tb;
        faders.fillRect(0,0,1,height);
        faders.fillStyle = bt;
        faders.fillRect(1,0,1,height);
      };

      resize() {
        colSize = colWidth + colSpacing;
        rowSize = rowHeight + rowSpacing;

        width = ((colSize * cols) - colSpacing) + midSpacing;
        height = (rowSize * rows) - rowSpacing;

        ground.canvas.width =
        bitmap.canvas.width =
        buffer.canvas.width =
        masker.canvas.width =
        screen.canvas.width = width;

        ground.canvas.height =
        bitmap.canvas.height =
        buffer.canvas.height =
        masker.canvas.height =
        faders.canvas.height =
        screen.canvas.height = height;

        ground.imageSmoothingEnabled =
        bitmap.imageSmoothingEnabled =
        buffer.imageSmoothingEnabled =
        masker.imageSmoothingEnabled =
        faders.imageSmoothingEnabled =
        screen.imageSmoothingEnabled = false;

        ground.globalCompositeOperation =
        screen.globalCompositeOperation = "copy";

        container.style.width = width +"px";
        container.style.height = height +"px";
      };

      sampleFrequency() {
        var spread = (freqBin / (this.visual.cols * 2)) >> 0;
        var c = freqBin >> 2;
        var x = 0;
        var i, val;

        level = 0;
        analyser1.getByteFrequencyData(aldata);

        if (analyser2) {
          analyser2.getByteFrequencyData(ardata);

          for (i = 0; i < c; i += spread, x++) {
            val = aldata[i] / 255;
            level += val;
            fldata[x] = val;

            val = ardata[i] / 255;
            level += val;
            frdata[x] = val;
          }
        } else {
          for (i = 0; i < c; i += spread, x++) {
            val = aldata[i] / 255;
            level += val;
            fldata[x] = val;

            val = aldata[i + c] / 255;
            level += val;
            frdata[x] = val;
          }
        }

        level /= cols;
      };

      sampleTime() {
        var spread = (freqBin / this.visual.cols) >> 0;
        var abs = Math.abs;
        var c = freqBin >> 1;
        var x = 0;
        var i, val;

        level = 0;
        analyser1.getByteTimeDomainData(aldata);

        if (analyser2) {
          analyser2.getByteTimeDomainData(ardata);

          for (i = 0; i < c; i += spread, x++) {
            val = abs(aldata[i] - 128) / 128;
            level += val;
            fldata[x] = val * (2.0 - val);

            val = abs(ardata[i] - 128) / 128;
            level += val;
            frdata[x] = val * (2.0 - val);
          }
        } else {
          for (i = 0; i < c; i += spread, x++) {
            val = abs(aldata[i] - 128) / 128;
            level += val;
            fldata[x] = val * (2.0 - val);

            val = abs(aldata[i + c] - 128) / 128;
            level += val;
            frdata[x] = val * (2.0 - val);
          }
        }

        level /= cols;
      };
    }