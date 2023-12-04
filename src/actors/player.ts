import { Actor, Animation, Engine, range, vec } from 'excalibur'
import { ExplorerComponent } from '../components/explorerComponent'
import { MovementComponent } from '../components/movementComponent'
import { PlayerControllerComponent } from '../components/playerControllerComponent'
import { AnimationComponent } from '../components/animationComponent'
import { LookDirection } from '../utils/position'
import { SpriteComponent } from '../components/spriteComponent'
import { Resources } from '../resources'
import { Constants } from '../constants'
import { VisibleBehindObjectsComponent } from '../components/visibleBehindObjectsComponent'
import { InventoryComponent } from '../components/inventoryComponent'
import { Serializer } from '../utils/serializer'

export class Player extends Actor {
  onInitialize(_engine: Engine) {
    super.onInitialize(_engine)
    this.addTag('player')
    this.z = 10
    this.pos = vec(8, 8)
    this.addComponent<SpriteComponent>(
      new SpriteComponent({
        spriteSource: Resources.prototype,
        spriteSize: Constants.SpriteSize,
        spriteRow: 12,
        spriteCol: 4,
      }),
    )
    this.addComponent<ExplorerComponent>(new ExplorerComponent())
    this.addComponent<MovementComponent>(new MovementComponent(150))
    this.addComponent<PlayerControllerComponent>(new PlayerControllerComponent())
    this.addComponent<VisibleBehindObjectsComponent>(new VisibleBehindObjectsComponent())
    this.addComponent<AnimationComponent>(
      new AnimationComponent({
        walkingAnimations: {
          [LookDirection.West]: this.createBodyAnimation(range(16, 19)),
          [LookDirection.SouthWest]: this.createBodyAnimation(range(16, 19)),
          [LookDirection.NorthWest]: this.createBodyAnimation(range(16, 19)),
          [LookDirection.East]: this.createBodyAnimation(range(16, 19)),
          [LookDirection.SouthEast]: this.createBodyAnimation(range(16, 19)),
          [LookDirection.NorthEast]: this.createBodyAnimation(range(16, 19)),
          [LookDirection.North]: this.createBodyAnimation(range(20, 23)),
          [LookDirection.South]: this.createBodyAnimation(range(12, 15)),
        },
        idleAnimations: {
          [LookDirection.West]: this.createBodyAnimation(range(4, 7)),
          [LookDirection.SouthWest]: this.createBodyAnimation(range(4, 7)),
          [LookDirection.NorthWest]: this.createBodyAnimation(range(4, 7)),
          [LookDirection.East]: this.createBodyAnimation(range(4, 7)),
          [LookDirection.SouthEast]: this.createBodyAnimation(range(4, 7)),
          [LookDirection.NorthEast]: this.createBodyAnimation(range(4, 7)),
          [LookDirection.North]: this.createBodyAnimation(range(8, 11)),
          [LookDirection.South]: this.createBodyAnimation(range(0, 3)),
        },
      }),
    )
    const { weight, container } = Serializer.getInstance().getPlayerInventory()
    this.addComponent<InventoryComponent>(new InventoryComponent({ weight, container, maxWeight: 28 }))
  }

  protected createBodyAnimation(frameIndices: number[]) {
    const sprite = this.get<SpriteComponent>(SpriteComponent)
    return Animation.fromSpriteSheet(sprite.sheet, frameIndices, 100)
  }
}
