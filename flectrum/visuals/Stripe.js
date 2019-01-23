    class Stripe extends Basic {
      setup() {
        var x = 0;
        var i, l;

        this.cols = cols;
        this.midw = Math.ceil(cols / 2);
        this.midx = this.midw * colSize;
        this.step = colSize * 2;

        switch (meterMode) {
          case MeterMode.image:
            if (meterImage[0]) {
              let meter = meterImage[0];
              let midx = this.midx;

              for (i = 0, l = this.midw; i < l; i++) {
                bitmap.drawImage(meter, 0,0,meter.width,meter.height, x,0,colWidth,height);
                x += this.step;

                if (x == midx) {
                  x += midSpacing;
                  midx += colSize;
                }
              }

              if (meterImage[1]) {
                meter = meterImage[1];
              }

              bitmap.save();
              bitmap.translate(0,height);
              bitmap.scale(1,-1);

              x = colSize;
              if (x == midx) { x += midSpacing; }

              for (i = 0, l = this.midw; i < l; i++) {
                bitmap.drawImage(meter, 0,0,meter.width,meter.height, x,0,colWidth,height);
                x += this.step;

                if (x == midx) { x += midSpacing; }
              }

              bitmap.restore();
            }
            break;
          case MeterMode.color:
            for (i = 0, l = this.midw; i < l; i++) {
              bitmap.fillStyle = meterColor[0];
              bitmap.fillRect(x,0,colWidth,height);
              x += colSize;

              if (x == this.midx) { x += midSpacing; }

              bitmap.fillStyle = meterColor[1];
              bitmap.fillRect(x,0,colWidth,height);
              x += colSize;

              if (x == this.midx) { x += midSpacing; }
            }
            break;
          case MeterMode.foreground:
            if (foreImage) {
              bitmap.drawImage(foreImage, 0,0,foreImage.width,foreImage.height, 0,0,width,height);
            }
            break;
          default:
            let data1 = meterGradient[0];
            let data2 = meterGradient[1];
            let grad1 = bitmap.createLinearGradient(0,0,0,height);
            let grad2 = bitmap.createLinearGradient(0,height,0,0);

            for (i = 0, l = data1.length; i < l; i++) {
              grad1.addColorStop(data1[i], data1[++i]);
            }

            for (i = 0, l = data2.length; i < l; i++) {
              grad2.addColorStop(data2[i], data2[++i]);
            }

            for (i = 0, l = this.midw; i < l; i++) {
              bitmap.fillStyle = grad1;
              bitmap.fillRect(x,0,colWidth,height);
              x += colSize;

              if (x == this.midx) { x += midSpacing; }

              bitmap.fillStyle = grad2;
              bitmap.fillRect(x,0,colWidth,height);
              x += colSize;

              if (x == this.midx) { x += midSpacing; }
            }
            break;
        }

        this.grid();
        composer.createData();
      };

      update() {
        var am = alphas[0];
        var ap = alphas[1];
        var xl = 0;
        var xr = colSize;
        var i = 0;
        var l = this.midw;
        var lh, lv, rh, rv;

        this.before();

        if (xr == this.midx) { xr += midSpacing; }

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
              masker.drawImage(faders.canvas, 1,height-rh,1,rh, xr,0,colWidth,rh);
            }

            masker.globalAlpha = 1.0;
          } else {
            masker.fillStyle = am;
            masker.fillRect(xl,height-lh,colWidth,lh);
            masker.fillRect(xr,0,colWidth,rh);
          }

          if (peaks) {
            masker.fillStyle = ap;

            if (lv > pldata[i]) { pldata[i] = lv; }

            lh = height - ((pldata[i] * rows << 0) * rowSize - rowSpacing);
            masker.fillRect(xl,lh,colWidth,rowHeight);
            pldata[i] -= peakDecay;

            if (rv > prdata[i]) { prdata[i] = rv; }

            rh = ((prdata[i] * rows << 0) * rowSize - rowSpacing) - rowHeight;
            masker.fillRect(xr,rh,colWidth,rowHeight);
            prdata[i] -= peakDecay;
          }

          xl += this.step;
          xr += this.step;

          if (xl == this.midx || xr == this.midx) {
            xl += midSpacing;
            xr += midSpacing;
          }
        }

        this.after();
      };
    }