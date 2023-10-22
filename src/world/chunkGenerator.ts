import { Tile, TileMap, Vector } from 'excalibur'
import { createNoise2D, NoiseFunction2D } from 'simplex-noise'
import alea from 'alea'
import { Constants } from '../constants'

export interface ChunkWithPosition {
  readonly chunkPosition: Vector
}

export type Chunk = TileMap & ChunkWithPosition

export class ChunkGenerator {
  private static instance: ChunkGenerator
  private readonly terrainNoise: NoiseFunction2D
  private readonly resourceNoise: NoiseFunction2D

  constructor() {
    this.terrainNoise = createNoise2D(alea(0x00aaef12))
    this.resourceNoise = createNoise2D(alea(0x00aaef12))
  }

  public static getInstance(): ChunkGenerator {
    if (!ChunkGenerator.instance) {
      ChunkGenerator.instance = new ChunkGenerator()
    }

    return ChunkGenerator.instance
  }

  private setCellType(cell: Tile, tileType: string, resourceNoise: number) {
    const treeLevelRange = [0.9, 1]
    const stoneLevelRange = [0.85, 0.9]
    cell.data.set('type', tileType)
    if (tileType === 'plain' && resourceNoise > treeLevelRange[0] && resourceNoise < treeLevelRange[1]) {
      cell.addTag('tree')
    }
    if (tileType !== 'water' && resourceNoise > stoneLevelRange[0] && resourceNoise < stoneLevelRange[1]) {
      cell.addTag('stone')
    }
  }

  private calculateTileType(terrainNoise: number) {
    const maxWaterLevel = 0
    const maxSandLevel = 0.6
    const maxGrassLevel = 1

    if (terrainNoise >= maxWaterLevel && terrainNoise < maxSandLevel) {
      return 'shore'
    } else if (terrainNoise >= maxSandLevel && terrainNoise < maxGrassLevel) {
      return 'plain'
    } else if (terrainNoise >= maxGrassLevel) {
      return 'hill'
    } else {
      return 'water'
    }
  }

  public generateChunk(chunk: Chunk) {
    for (const cell of chunk.tiles) {
      const { x, y } = cell
      const terrainNoise = this.generateNoise(x, y, chunk.chunkPosition, this.terrainNoise)
      const treeNoise = this.resourceNoise(x, y)
      this.setCellType(cell, this.calculateTileType(terrainNoise), treeNoise)
    }
  }

  public getTileType(x: number, y: number, chunkPosition: Vector) {
    const terrainNoise = this.generateNoise(x, y, chunkPosition, this.terrainNoise)
    return this.calculateTileType(terrainNoise)
  }

  protected generateNoise(x: number, y: number, chunkPosition: Vector, noise: NoiseFunction2D) {
    const nX = (chunkPosition.x * Constants.ChunkSize + x) / 256
    const nY = (chunkPosition.y * Constants.ChunkSize + y) / 256
    const d = Math.min(1, (nX ** 2 + nY ** 2) / Math.sqrt(0.5))
    let e = noise(nX, nY) + 0.5 * noise(2 * nX, 2 * nY) + 0.25 * noise(4 * nX, 4 * nY)
    e = (e + (1 - d)) / 2
    return Math.pow(e, 0.2)
  }
}
