import { Component, Entity, GraphicsComponent, System, SystemType, SystemTypes } from 'excalibur'
import { AnimationComponent } from '../components/animationComponent'
import { LookDirection, MovementType } from '../utils/position'
import { MovementComponent } from '../components/movementComponent'

export class AnimationSystem extends System {
  readonly systemType: SystemType = SystemType.Update
  readonly types: SystemTypes<Component>[] = ['animation']

  update(entities: Entity[]): void {
    for (const entity of entities) {
      const component = entity.get<AnimationComponent>(AnimationComponent)
      const movement = entity.get<MovementComponent>(MovementComponent)
      const graphics = entity.get<GraphicsComponent>(GraphicsComponent)

      if (movement && graphics && component) {
        if (movement.movement === MovementType.Idle) {
          graphics.use(component.idleAnimations[movement.direction])
        }
        if (movement.movement === MovementType.Moving) {
          graphics.use(component.walkingAnimations[movement.direction])
        }
        graphics.flipHorizontal = !(
          movement.direction in
          [LookDirection.West, LookDirection.SouthWest, LookDirection.NorthWest, LookDirection.NorthEast]
        )
      }
    }
  }
}
