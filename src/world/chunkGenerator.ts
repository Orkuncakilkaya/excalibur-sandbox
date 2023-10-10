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
  private readonly treeNoise: NoiseFunction2D

  constructor() {
    this.terrainNoise = createNoise2D(alea(0x00aaef12))
    this.treeNoise = createNoise2D(alea(0x00aaef12))
  }

  public static getInstance(): ChunkGenerator {
    if (!ChunkGenerator.instance) {
      ChunkGenerator.instance = new ChunkGenerator()
    }

    return ChunkGenerator.instance
  }

  private setCellType(cell: Tile, terrainNoise: number, treeNoise: number) {
    const maxWaterLevel = 0
    const maxSandLevel = 0.6
    const maxGrassLevel = 0.92

    const treeLevelRange = [0.9, 1]

    if (terrainNoise >= maxWaterLevel && terrainNoise < maxSandLevel) {
      cell.addTag('shore')
    } else if (terrainNoise >= maxSandLevel && terrainNoise < maxGrassLevel) {
      if (treeNoise > treeLevelRange[0] && treeNoise < treeLevelRange[1]) {
        cell.addTag('tree')
      }
      cell.addTag('plain')
    } else if (terrainNoise >= maxGrassLevel) {
      cell.addTag('hill')
    } else {
      cell.addTag('water')
    }
  }

  public generateChunk(chunk: Chunk) {
    for (const cell of chunk.tiles) {
      const { x, y } = cell
      const terrainNoise = this.generateNoise(x, y, chunk, this.terrainNoise)
      const treeNoise = this.treeNoise(x, y)
      this.setCellType(cell, terrainNoise, treeNoise)
    }
  }

  protected generateNoise(x: number, y: number, chunk: Chunk, noise: NoiseFunction2D) {
    const nX = (chunk.chunkPosition.x * Constants.ChunkSize + x) / 256
    const nY = (chunk.chunkPosition.y * Constants.ChunkSize + y) / 256
    const d = Math.min(1, (nX ** 2 + nY ** 2) / Math.sqrt(0.5))
    let e = noise(nX, nY) + 0.5 * noise(2 * nX, 2 * nY) + 0.25 * noise(4 * nX, 4 * nY)
    e = (e + (1 - d)) / 2
    return Math.pow(e, 0.2)
  }
}
