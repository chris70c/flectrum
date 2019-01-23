    class Outward extends Basic {
      setup() {
        var i, l;

        this.cols = cols * 2;
        this.midw = Math.ceil(cols / 2);
        this.midh = Math.ceil(rows / 2);
        this.midy = this.midh * rowSize;

        switch (meterMode) {
          case MeterMode.image:
            if (meterImage[0]) {
              let meter = meterImage[0];
              let x = 0;

              for (i = 0, l = cols; i < l;) {
                bitmap.drawImage(meter, 0,0,meter.width,meter.height, x,0,colWidth,this.midy);
                x += colSize;

                if (++i == this.midw) { x += midSpacing; }
              }

              if (meterImage[1]) {
                meter = meterImage[1];
              }

              bitmap.save();
              bitmap.translate(0,height);
              bitmap.scale(1,-1);
              x = 0;

              for (i = 0, l = cols; i < l;) {
                bitmap.drawImage(meter, 0,0,meter.width,meter.height, x,0,colWidth,this.midy);
                x += colSize;

                if (++i == this.midw) { x += midSpacing; }
              }

              bitmap.restore();
            }
            break;
          case MeterMode.color:
            bitmap.fillStyle = meterColor[0];
            bitmap.fillRect(0,0,width,this.midy);

            bitmap.fillStyle = meterColor[1];
            bitmap.fillRect(0,this.midy,width,height);
            break;
          case MeterMode.foreground:
            if (foreImage) {
              bitmap.drawImage(foreImage, 0,0,foreImage.width,foreImage.height, 0,0,width,height);
            }
            break;
          default:
            let data = meterGradient[0];
            let grad = bitmap.createLinearGradient(0,0,0,this.midy);

            for (i = 0, l = data.length; i < l; i++) {
              grad.addColorStop(data[i], data[++i]);
            }

            bitmap.fillStyle = grad;
            bitmap.fillRect(0,0,width,this.midy);

            data = meterGradient[1];
            grad = bitmap.createLinearGradient(0,height,0,this.midy);

            for (i = 0, l = data.length; i < l; i++) {
              grad.addColorStop(data[i], data[++i]);
            }

            bitmap.fillStyle = grad;
            bitmap.fillRect(0,this.midy,width,height);
            break;
        }

        this.grid();
        composer.createData();
      };

      update() {
        var am = alphas[0];
        var ap = alphas[1];
        var i = 0;
        var l = cols;
        var x = 0;
        var lh, lv, rh, rv;

        this.before();

        for (; i < l;) {
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

          lh = ((lv * this.midh) << 0) * rowSize;
          rh = ((rv * this.midh) << 0) * rowSize - rowSpacing;

          if (fades) {
            masker.globalAlpha = meterOpacity;

            if (lh) {
              masker.drawImage(faders.canvas, 0,0,1,lh, x,this.midy-lh,colWidth,lh);
            }

            if (rh) {
              masker.drawImage(faders.canvas, 1,height-rh,1,rh, x,this.midy,colWidth,rh);
            }

            masker.globalAlpha = 1.0;
          } else {
            masker.fillStyle = am;
            masker.fillRect(x,this.midy-lh,colWidth,lh);
            masker.fillRect(x,this.midy,colWidth,rh);
          }

          if (peaks) {
            masker.fillStyle = ap;

            if (lv > pldata[i]) { pldata[i] = lv; }
            lh = this.midy - ((pldata[i] * this.midh << 0) * rowSize);

            if (lh < this.midy) {
              masker.fillRect(x,lh,colWidth,rowHeight);
              pldata[i] -= peakDecay;
            }

            if (rv > prdata[i]) { prdata[i] = rv; }
            rh = this.midy + ((prdata[i] * this.midh << 0) * rowSize - rowSpacing) - rowHeight;

            if (rh > this.midy) {
              masker.fillRect(x,rh,colWidth,rowHeight);
              prdata[i] -= peakDecay;
            }
          }

          x += colSize;

          if (++i == this.midw) { x += midSpacing; }
        }

        this.after();
      };
    }