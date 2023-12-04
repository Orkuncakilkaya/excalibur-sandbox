import { Tile } from 'excalibur'
import { globalPositionToChunkPosition } from './position'
import { InventoryComponent } from '../components/inventoryComponent'
import { Items } from '../resources'
import { ItemComponent } from '../components/itemComponent'
import { WorldManager } from '../world/worldManager'
import { PlayerControllerComponent } from '../components/playerControllerComponent'
import { Player } from '../actors/player'

type SerializableVector = {
  x: number
  y: number
}

type ChunksGenerated = SerializableVector[]
type RemovedResourcesByChunk = { [key: string]: SerializableVector[] }
type SerializableItem = {
  name: string
  stack: number
  durability: number
}

type SerializableInventory = {
  container: SerializableItem[]
}

export class Serializer {
  private static instance: Serializer
  private chunksGenerated: ChunksGenerated = []
  private removedResourcesByChunk: RemovedResourcesByChunk = {}
  private playerInventory: SerializableInventory

  private constructor() {
    this.chunksGenerated = JSON.parse(localStorage.getItem('@game/chunksGenerated') ?? '[]') as ChunksGenerated
    this.chunksGenerated.map((vector) => {
      const id = this.getChunkId(vector.x, vector.y)
      this.removedResourcesByChunk[id] = JSON.parse(localStorage.getItem(`@game/removedResources/${id}`) ?? '[]')
    })
    this.playerInventory = JSON.parse(
      localStorage.getItem('@game/playerInventory') ?? '{"container": []}',
    ) as SerializableInventory
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Serializer()
    }

    return this.instance
  }

  private getChunkId(x: number, y: number) {
    return `${x}|${y}`
  }

  removeResourceFromWorld(cell: Tile) {
    const chunkPosition = globalPositionToChunkPosition(cell.pos.x, cell.pos.y)
    const chunkId = this.getChunkId(chunkPosition.x, chunkPosition.y)
    if (!this.chunksGenerated.find((t) => t.x === chunkPosition.x && t.y === chunkPosition.y)) {
      this.chunksGenerated.push({ x: chunkPosition.x, y: chunkPosition.y })
    }
    if (!(chunkId in this.removedResourcesByChunk)) {
      this.removedResourcesByChunk[chunkId] = []
    }
    this.removedResourcesByChunk[chunkId].push({ x: cell.x, y: cell.y })
  }

  getRemovedResources(x: number, y: number) {
    return this.removedResourcesByChunk[this.getChunkId(x, y)] ?? []
  }

  getPlayerInventory() {
    const container: ItemComponent[] = this.playerInventory.container.map((serialized) => {
      const item = Items[serialized.name] as ItemComponent
      return new ItemComponent({
        ...item,
        stack: serialized.stack,
        durability: serialized.durability,
      })
    })
    const weight = container.reduce((acc, item) => acc + item.weight * item.stack, 0)
    return { weight, container }
  }

  save() {
    localStorage.setItem('@game/chunksGenerated', JSON.stringify(this.chunksGenerated))
    Object.keys(this.removedResourcesByChunk).forEach((id) => {
      localStorage.setItem(`@game/removedResources/${id}`, JSON.stringify(this.removedResourcesByChunk[id]))
    })
    const player = WorldManager.getInstance()
      .getScene()
      .actors.find((t) => t.get<PlayerControllerComponent>(PlayerControllerComponent)) as Player
    if (player) {
      const inventory = player.get<InventoryComponent>(InventoryComponent)
      const container: SerializableItem[] = inventory.container.map((item) => {
        return {
          name: item.name,
          durability: item.durability,
          stack: item.stack,
        }
      })
      localStorage.setItem('@game/playerInventory', JSON.stringify({ container }))
    }
  }
}
