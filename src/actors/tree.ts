import { Actor, Engine, Sprite, vec } from 'excalibur'
import { Resources } from '../resources'
import { Constants } from '../constants'

export class Tree extends Actor {
  onInitialize(_engine: Engine) {
    super.onInitialize(_engine)
    const sprite = new Sprite({
      image: Resources.tinyTown,
      sourceView: {
        x: Constants.TileSize * 4,
        y: 0,
        width: Constants.TileSize,
        height: Constants.TileSize * 2,
      },
    })
    this.pos.setTo(24, 8)
    this.z = 11
    this.graphics.use(sprite)
    this.collider.useBoxCollider(16, 16, vec(0, -0.5))
    this.addTag('solid')
    this.addTag('tree')
  }
}
