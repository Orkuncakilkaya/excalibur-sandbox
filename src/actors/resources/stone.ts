import { Actor, Engine, Sprite, Vector } from 'excalibur'
import { Items, Resources } from '../../resources'
import { Constants } from '../../constants'
import { GatherableComponent } from '../../components/gatherableComponent'

export class Stone extends Actor {
  constructor(pos?: Vector) {
    super()
    if (pos) {
      this.pos = pos
    }
  }

  onInitialize(_engine: Engine) {
    super.onInitialize(_engine)
    const sprite = new Sprite({
      image: Resources.tinyBattle,
      sourceView: {
        x: Constants.TileSize * 6,
        y: 0,
        width: Constants.TileSize,
        height: Constants.TileSize,
      },
    })
    this.z = 11
    this.graphics.use(sprite)
    this.collider.useBoxCollider(16, 16)
    this.addTag('solid')
    this.addTag('stone')
    this.addComponent<GatherableComponent>(new GatherableComponent([Items.stone]))
  }
}
