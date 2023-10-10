import { Chunk } from './chunk'
import { Scene, vec, Vector } from 'excalibur'
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
      Constants.ChunkSize * Constants.SpriteSize * position.x,
      Constants.ChunkSize * Constants.SpriteSize * position.y,
    )
    this.addChunk(chunk)
    return chunk
  }

  protected addChunk(chunk: Chunk) {
    this.chunks.push(chunk)
    this.scene.add(chunk)
    return chunk
  }

  public findOrCreateChunk(vector: Vector) {
    let target = this.chunks.find((t) => t.chunkPosition.x === vector.x && t.chunkPosition.y === vector.y)
    if (!target) {
      target = this.createChunk(vector)
    }

    return target
  }

  public setChunkVisible(vector: Vector) {
    this.hideAllChunks()

    const target = this.findOrCreateChunk(vector)
    const visibleChunks = this.getChunkNeighbours(target.chunkPosition).map((neighbour) => {
      this.findOrCreateChunk(neighbour)
      return neighbour
    })
    visibleChunks.push(vector)

    this.makeChunksVisible(visibleChunks)
  }

  protected hideAllChunks() {
    this.chunks.forEach((chunk) => {
      chunk.active = false
      return chunk
    })
  }

  protected makeChunksVisible(vectorList: Vector[]) {
    for (const vector of vectorList) {
      this.chunks.forEach((chunk) => {
        if (Vector.distance(vector, chunk.chunkPosition)) {
          chunk.active = true
        }
        return chunk
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
