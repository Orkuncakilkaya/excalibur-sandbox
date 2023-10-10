import { Actor, Circle, Color, Engine, Vector } from 'excalibur'

export class PointActor extends Actor {
  constructor(position: Vector) {
    super()
    this.pos = position
  }

  onInitialize(_engine: Engine) {
    super.onInitialize(_engine)
    const circle = new Circle({
      color: Color.Red,
      radius: 32,
    })
    this.collider.useCircleCollider(32)
    this.graphics.use(circle)
  }
}
