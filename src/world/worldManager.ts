import { Chunk } from './chunk'
import { GraphicsComponent, Scene, vec, Vector } from 'excalibur'
import { Constants } from '../constants'

export class WorldManager {
  public static instance: WorldManager
  protected scene: Scene
  protected chunks: Chunk[] = []

  private constructor(scene: Scene) {
    this.scene = scene
  }

  public static getInstance(scene?: Scene) {
    if (scene) {
      if (!WorldManager.instance) {
        WorldManager.instance = new WorldManager(scene)
      }
    }

    return WorldManager.instance
  }

  public createChunk(position: Vector) {
    const chunk = new Chunk({
      pos: position,
    })
    chunk.pos = vec(
      Constants.ChunkSize * Constants.TileSize * position.x,
      Constants.ChunkSize * Constants.TileSize * position.y,
    )
    return this.addChunk(chunk)
  }

  protected addChunk(chunk: Chunk) {
    this.chunks.push(chunk)
    this.scene.add(chunk)
    return chunk
  }

  public findOrCreateChunk(vector: Vector) {
    const target = this.chunks.find((t) => t.chunkPosition.x === vector.x && t.chunkPosition.y === vector.y)

    return target ?? this.createChunk(vector)
  }

  public setChunkVisible(vector: Vector) {
    this.chunks.forEach((chunk) => {
      const graphics = chunk.get<GraphicsComponent>(GraphicsComponent)
      graphics.visible = false
    })
    const target = this.findOrCreateChunk(vector)
    const vectors = this.getChunkNeighbours(target.chunkPosition).map((neighbour) => {
      this.findOrCreateChunk(neighbour)
      return neighbour
    })
    vectors.push(vector)
    for (const vect of vectors) {
      this.chunks.forEach((chunk) => {
        if (chunk.chunkPosition.x === vect.x && chunk.chunkPosition.y === vect.y) {
          const graphics = chunk.get<GraphicsComponent>(GraphicsComponent)
          graphics.visible = true
        }
      })
    }
  }

  protected getChunkNeighbours(vector: Vector) {
    const east = vec(vector.x + 1, vector.y)
    const west = vec(vector.x - 1, vector.y)
    const south = vec(vector.x, vector.y + 1)
    const north = vec(vector.x, vector.y - 1)
    const northEast = vec(vector.x + 1, vector.y - 1)
    const northWest = vec(vector.x - 1, vector.y - 1)
    const southEast = vec(vector.x + 1, vector.y + 1)
    const southWest = vec(vector.x - 1, vector.y + 1)

    return [east, west, south, north, northEast, northWest, southEast, southWest]
  }
}
