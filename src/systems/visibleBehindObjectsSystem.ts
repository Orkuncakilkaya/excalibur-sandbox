import {
  Actor,
  Component,
  Entity,
  Ray,
  System,
  SystemType,
  SystemTypes,
  TransformComponent,
  vec,
  Vector,
} from 'excalibur'
import { VisibleBehindObjectsComponent } from '../components/visibleBehindObjectsComponent'

export class VisibleBehindObjectsSystem extends System {
  readonly systemType: SystemType = SystemType.Update
  readonly types: SystemTypes<Component>[] = ['visibleBehindObjects']

  update(entities: Entity[]): void {
    for (const entity of entities) {
      const component = entity.get<VisibleBehindObjectsComponent>(VisibleBehindObjectsComponent)
      const transform = entity.get<TransformComponent>(TransformComponent)
      const scene = entity.scene

      const ray = new Ray(vec(transform.pos.x, transform.pos.y), Vector.Zero)
      const hits = scene.physics.rayCast(ray, {
        searchAllColliders: true,
        maxDistance: 16,
      })
      while (component.toBeOpaque.length) {
        const actor = component.toBeOpaque.pop()
        actor.graphics.opacity = 1
      }
      for (const hit of hits) {
        const isPlayerVisible = hit.collider.owner.hasTag('playerVisible')
        if (isPlayerVisible) {
          const actor = hit.collider.owner as Actor
          actor.graphics.opacity = 0.2
          component.toBeOpaque.push(actor)
        }
      }
    }
  }
}
