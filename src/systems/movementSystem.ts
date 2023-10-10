import { Component, Entity, MotionComponent, System, SystemType, SystemTypes, vec, Vector } from 'excalibur'
import { compassToDirection, LookDirection, MovementType } from '../utils/position'
import { MovementComponent } from '../components/movementComponent'

export class MovementSystem extends System {
  readonly systemType: SystemType = SystemType.Update
  readonly types: SystemTypes<Component>[] = ['movement']

  update(entities: Entity[]): void {
    for (const entity of entities) {
      const component = entity.get<MovementComponent>(MovementComponent)
      const motion = entity.get<MotionComponent>(MotionComponent)
      if (component && motion) {
        let nextDirection: LookDirection = component.oldDirection
        const nextMovementType =
          Math.abs(Vector.distance(vec(0, 0), motion.vel)) > 0 ? MovementType.Moving : MovementType.Idle
        if (nextMovementType === MovementType.Moving) {
          const compass = (Math.round(Math.atan2(motion.vel.y, motion.vel.x) / ((2 * Math.PI) / 8)) + 8) % 8
          nextDirection = compassToDirection(compass)
        }
        component.oldMovement = nextMovementType
        component.oldDirection = nextDirection
        component.movement = nextMovementType
        component.direction = nextDirection
      }
    }
  }
}
