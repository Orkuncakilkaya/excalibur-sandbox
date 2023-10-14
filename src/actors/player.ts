import { Actor, Animation, Engine, range, Ray, vec, Vector } from 'excalibur'
import { ExplorerComponent } from '../components/explorerComponent'
import { MovementComponent } from '../components/movementComponent'
import { PlayerControllerComponent } from '../components/playerControllerComponent'
import { AnimationComponent } from '../components/animationComponent'
import { LookDirection } from '../utils/position'
import { SpriteComponent } from '../components/spriteComponent'
import { Resources } from '../resources'
import { Constants } from '../constants'

export class Player extends Actor {
  protected toBeOpaque: Actor[] = []
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
  }

  protected createBodyAnimation(frameIndices: number[]) {
    const sprite = this.get<SpriteComponent>(SpriteComponent)
    return Animation.fromSpriteSheet(sprite.sheet, frameIndices, 100)
  }

  onPostUpdate(_engine: Engine, _delta: number) {
    super.onPostUpdate(_engine, _delta)
    const ray = new Ray(vec(this.pos.x, this.pos.y), Vector.Zero)
    const hits = _engine.currentScene.physics.rayCast(ray, {
      searchAllColliders: true,
      maxDistance: 32,
    })
    while (this.toBeOpaque.length) {
      const actor = this.toBeOpaque.pop()
      actor.graphics.opacity = 1
    }
    for (const hit of hits) {
      const isPlayerVisible = hit.collider.owner.hasTag('playerVisible')
      if (isPlayerVisible) {
        const actor = hit.collider.owner as Actor
        actor.graphics.opacity = 0.2
        this.toBeOpaque.push(actor)
      }
    }
  }
}
