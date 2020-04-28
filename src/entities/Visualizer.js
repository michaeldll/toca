export default class Visualizer {
  constructor(analyser, dataArray, bufferLength, position, color, radius) {
    this.analyser = analyser;
    this.dataArray = dataArray;
    this.bufferLength = bufferLength;
    this.position = position;
    this.color = color;
    this.radius = radius;
  }

  draw(ctx, rad, direction) {
    this.analyser.getByteTimeDomainData(this.dataArray);

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color;

    // ctx.save();

    ctx.beginPath();

    const sliceWidth = 0.05;
    let x = this.position.x;
    let y;

    const drawBeginning = () => {
      for (let i = 0; i < this.bufferLength; i++) {
        const v = this.dataArray[i] / 256;
        y = v * this.position.y;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        //0 = from left to right
        //1 = from right to left
        //2 = from up to down
        //3 = from down to up
        switch (direction) {
          case 0:
            x += sliceWidth;
            break;

          case 1:
            x -= sliceWidth;
            break;

          case 2:
            y += sliceWidth;
            break;

          case 3:
            y -= sliceWidth;
            break;

          default:
            break;
        }
        if (direction === 0) {
          x += sliceWidth;
        } else {
          x -= sliceWidth;
        }
      }
    };

    const drawEnd = rad => {
      const circleX = canvas.width / 2;
      const circleY = canvas.height / 2;
      const radius = this.radius;
      // reset and move to the center of our circle
      ctx.setTransform(1, 0, 0, 1, circleX, circleY);
      // rotate the context so we face the correct angle
      ctx.rotate(rad);
      // move along y axis to reach the inner radius
      ctx.lineTo(0, radius);
    };

    drawBeginning();

    drawEnd(rad);

    ctx.stroke();

    // ctx.restore();
  }
}
