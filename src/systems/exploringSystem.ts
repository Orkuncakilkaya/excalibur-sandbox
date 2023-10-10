import { Component, Entity, System, SystemType, SystemTypes, TransformComponent, vec, Vector } from 'excalibur'
import { ExplorerComponent } from '../components/explorerComponent'
import { globalPositionToChunkPosition } from '../utils/position'
import { WorldManager } from '../world/worldManager'

export class ExploringSystem extends System {
  readonly systemType: SystemType = SystemType.Draw
  readonly types: SystemTypes<Component>[] = ['explorer']
  protected initialized: boolean = false

  update(entities: Entity[]): void {
    const world = WorldManager.getInstance()
    if (!this.initialized) {
      world.setChunkVisible(vec(0, 0))
      this.initialized = true
    }
    for (const entity of entities) {
      const transform = entity.get<TransformComponent>(TransformComponent)
      const component = entity.get<ExplorerComponent>(ExplorerComponent)
      if (transform && component) {
        const newChunkPosition = globalPositionToChunkPosition(transform.pos.x, transform.pos.y)
        const diff = Vector.distance(newChunkPosition, component.chunkPosition)
        if (diff !== 0) {
          world.setChunkVisible(newChunkPosition)
          component.chunkPosition = newChunkPosition
        }
      }
    }
  }
}
