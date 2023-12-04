import { Chunk } from './chunk'
import { Scene, vec, Vector } from 'excalibur'
import { Constants } from '../constants'

export class WorldManager {
  public static instance: WorldManager
  protected scene: Scene

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
    let chunk = this.scene.tileMaps.find((t) => t.active === false) as Chunk
    if (!chunk) {
      chunk = new Chunk({
        pos: position,
      })
    }
    chunk.chunkPosition = position
    chunk.pos = vec(
      Constants.ChunkSize * Constants.TileSize * position.x,
      Constants.ChunkSize * Constants.TileSize * position.y,
    )
    chunk.generateTiles()

    this.scene.add(chunk)

    return chunk
  }

  public findOrCreateChunk(vector: Vector) {
    const target = this.scene.tileMaps.find(
      (t: Chunk) => t.chunkPosition.x === vector.x && t.chunkPosition.y === vector.y,
    )

    return target ?? this.createChunk(vector)
  }

  public setChunkVisible(vector: Vector) {
    const target = this.findOrCreateChunk(vector) as Chunk
    const vectors = this.getChunkNeighbours(target.chunkPosition).map((neighbour) => {
      this.findOrCreateChunk(neighbour)
      return neighbour
    })
    vectors.push(vector)

    this.scene.tileMaps.forEach((chunk: Chunk) => {
      if (!vectors.includes(chunk.chunkPosition)) {
        chunk.active = false
      }
    })
    for (const vect of vectors) {
      this.scene.tileMaps.forEach((chunk: Chunk) => {
        if (chunk.chunkPosition.x === vect.x && chunk.chunkPosition.y === vect.y) {
          chunk.active = true
        }
      })
    }
  }

  public getScene() {
    return this.scene
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
