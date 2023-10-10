import { Actor, Animation, Engine, range, vec } from 'excalibur'
import { ExplorerComponent } from '../components/explorerComponent'
import { MovementComponent } from '../components/movementComponent'
import { PlayerControllerComponent } from '../components/playerControllerComponent'
import { AnimationComponent } from '../components/animationComponent'
import { LookDirection } from '../utils/position'
import { SpriteComponent } from '../components/spriteComponent'
import { Resources } from '../resources'
import { Constants } from '../constants'

export class Player extends Actor {
  onInitialize(_engine: Engine) {
    super.onInitialize(_engine)
    this.addTag('player')
    this.z = 10
    this.pos = vec(32, 32)
    this.addComponent<SpriteComponent>(
      new SpriteComponent({
        spriteSource: Resources.BodyMale,
        spriteSize: Constants.SpriteSize,
        spriteRow: 4,
        spriteCol: 9,
      }),
    )
    this.addComponent<ExplorerComponent>(new ExplorerComponent())
    this.addComponent<MovementComponent>(new MovementComponent(300))
    this.addComponent<PlayerControllerComponent>(new PlayerControllerComponent())
    this.addComponent<AnimationComponent>(
      new AnimationComponent({
        walkingAnimations: {
          [LookDirection.West]: this.createBodyAnimation(range(9, 17)),
          [LookDirection.SouthWest]: this.createBodyAnimation(range(9, 17)),
          [LookDirection.NorthWest]: this.createBodyAnimation(range(9, 17)),
          [LookDirection.East]: this.createBodyAnimation(range(27, 35)),
          [LookDirection.SouthEast]: this.createBodyAnimation(range(27, 35)),
          [LookDirection.NorthEast]: this.createBodyAnimation(range(27, 35)),
          [LookDirection.North]: this.createBodyAnimation(range(0, 8)),
          [LookDirection.South]: this.createBodyAnimation(range(18, 26)),
        },
        idleAnimations: {
          [LookDirection.West]: this.createBodyAnimation([9]),
          [LookDirection.SouthWest]: this.createBodyAnimation([9]),
          [LookDirection.NorthWest]: this.createBodyAnimation([9]),
          [LookDirection.East]: this.createBodyAnimation([27]),
          [LookDirection.SouthEast]: this.createBodyAnimation([27]),
          [LookDirection.NorthEast]: this.createBodyAnimation([27]),
          [LookDirection.North]: this.createBodyAnimation([0]),
          [LookDirection.South]: this.createBodyAnimation([18]),
        },
      }),
    )
  }

  protected createBodyAnimation(frameIndices: number[]) {
    const sprite = this.get<SpriteComponent>(SpriteComponent)
    return Animation.fromSpriteSheet(sprite.sheet, frameIndices, 100)
  }
}
