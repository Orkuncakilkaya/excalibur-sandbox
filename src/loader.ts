import { Loader as ExcaliburLoader } from 'excalibur'
export class Loader extends ExcaliburLoader {
  draw(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`Loading\n${this.progress}%`, 30, 30)
  }
}
