    class Basic {
      setup() {
        var i, l;

        this.cols = cols;
        this.midw = Math.ceil(cols / 2);
        this.midx = this.midw * colSize;

        switch (meterMode) {
          case MeterMode.image:
            if (meterImage[0]) {
              let meter = meterImage[0];
              let x = 0;

              for (i = 0, l = cols; i < l; i++) {
                if (i == this.midw) {
                  if (meterImage[1]) {
                    meter = meterImage[1];
                  }

                  x += midSpacing;
                }

                bitmap.drawImage(meter, 0,0,meter.width,meter.height, x,0,colWidth,height);
                x += colSize;
              }
            }
            break;
          case MeterMode.color:
            bitmap.fillStyle = meterColor[0];
            bitmap.fillRect(0,0,this.midx,height);

            bitmap.fillStyle = meterColor[1];
            bitmap.fillRect(this.midx+midSpacing,0,width,height);
            break;
          case MeterMode.foreground:
            if (foreImage) {
              bitmap.drawImage(foreImage, 0,0,foreImage.width,foreImage.height, 0,0,width,height);
            }
            break;
          default:
            let data = meterGradient[0];
            let grad = bitmap.createLinearGradient(0,0,0,height);

            for (i = 0, l = data.length; i < l; i++) {
              grad.addColorStop(data[i], data[++i]);
            }

            bitmap.fillStyle = grad;
            bitmap.fillRect(0,0,this.midx,height);

            data = meterGradient[1];
            grad = bitmap.createLinearGradient(0,0,0,height);

            for (i = 0, l = data.length; i < l; i++) {
              grad.addColorStop(data[i], data[++i]);
            }

            bitmap.fillStyle = grad;
            bitmap.fillRect(this.midx+midSpacing,0,width,height);
            break;
        }

        this.grid();
        composer.createData();
      };

      grid() {
        var i, l, p;

        if (rowSpacing) {
          p = rowHeight;

          for (i = 0, l = rows - 1; i < l; i++) {
            bitmap.clearRect(0,p,width,rowSpacing);
            p += rowSize;
          }
        }

        if (midSpacing) {
          bitmap.clearRect(this.midx,0,midSpacing,height);
        }

        if (meterMode == MeterMode.image) { return; }

        if (colSpacing) {
          p = colWidth;

          for (i = 0, l = cols - 1; i < l;) {
            bitmap.clearRect(p,0,colSpacing,height);
            p += colSize;

            if (++i == this.midw) {
              p += midSpacing;
            }
          }
        }
      };

      before() {
        if (trails) {
          screen.globalCompositeOperation = "copy";
          screen.globalAlpha = trailOpacity;
          screen.drawImage(screen.canvas,0,0);
          screen.globalAlpha = 1.0;
          screen.globalCompositeOperation = "source-over";
        }

        buffer.drawImage(bitmap.canvas,0,0);
        masker.clearRect(0,0,width,height);
      };

      after() {
        buffer.globalCompositeOperation = "destination-in";
        buffer.drawImage(masker.canvas,0,0);
        buffer.globalCompositeOperation = "copy";

        screen.drawImage(buffer.canvas,0,0);
      };

      update() {
        var am = alphas[0];
        var ap = alphas[1];
        var xl = 0;
        var xr = this.midx + midSpacing;
        var i = 0;
        var l = this.midw;
        var lh, lv, rh, rv;

        this.before();

        for (; i < l; i++) {
          lv = fldata[i];
          rv = frdata[i];

          if (decay) {
            if (lv < cldata[i]) {
              lv = (cldata[i] -= meterDecay);
              if (lv < 0.0) { lv = 0.0; }
            } else {
              cldata[i] = lv;
            }

            if (rv < crdata[i]) {
              rv = (crdata[i] -= meterDecay);
              if (rv < 0.0) { rv = 0.0; }
            } else {
              crdata[i] = rv;
            }
          }

          lh = ((lv * rows) << 0) * rowSize - rowSpacing;
          rh = ((rv * rows) << 0) * rowSize - rowSpacing;

          if (fades) {
            masker.globalAlpha = meterOpacity;

            if (lh) {
              masker.drawImage(faders.canvas, 0,0,1,lh, xl,height-lh,colWidth,lh);
            }

            if (rh) {
              masker.drawImage(faders.canvas, 0,0,1,rh, xr,height-rh,colWidth,rh);
            }

            masker.globalAlpha = 1.0;
          } else {
            masker.fillStyle = am;
            masker.fillRect(xl,height-lh,colWidth,lh);
            masker.fillRect(xr,height-rh,colWidth,rh);
          }

          if (peaks) {
            masker.fillStyle = ap;

            if (lv > pldata[i]) { pldata[i] = lv; }

            lh = height - ((pldata[i] * rows << 0) * rowSize - rowSpacing);
            masker.fillRect(xl,lh,colWidth,rowHeight);
            pldata[i] -= peakDecay;

            if (rv > prdata[i]) { prdata[i] = rv; }

            rh = height - ((prdata[i] * rows << 0) * rowSize - rowSpacing);
            masker.fillRect(xr,rh,colWidth,rowHeight);
            prdata[i] -= peakDecay;
          }

          xl += colSize;
          xr += colSize;
        }

        this.after();
      };
    }