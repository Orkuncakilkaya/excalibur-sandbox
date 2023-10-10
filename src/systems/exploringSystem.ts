import { Component, Entity, System, SystemType, SystemTypes, TransformComponent, Vector } from 'excalibur'
import { ExplorerComponent } from '../components/explorerComponent'
import { globalPositionToChunkPosition } from '../utils/position'
import { WorldManager } from '../world/worldManager'

export class ExploringSystem extends System {
  readonly systemType: SystemType = SystemType.Update
  readonly types: SystemTypes<Component>[] = ['explorer']
  protected initialized: boolean = false

  update(entities: Entity[]): void {
    for (const entity of entities) {
      const transform = entity.get<TransformComponent>(TransformComponent)
      const component = entity.get<ExplorerComponent>(ExplorerComponent)
      if (transform && component) {
        const newChunkPosition = globalPositionToChunkPosition(transform.pos.x, transform.pos.y)
        const diff = Vector.distance(newChunkPosition, component.chunkPosition)
        if (diff !== 0 || this.initialized) {
          const world = WorldManager.getInstance()
          world.setChunkVisible(newChunkPosition)
          component.chunkPosition = newChunkPosition
        }
      }
    }
    if (!this.initialized) {
      this.initialized = true
    }
  }
}
