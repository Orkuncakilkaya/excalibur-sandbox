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
  private readonly generateNoise: NoiseFunction2D

  constructor() {
    this.generateNoise = createNoise2D(alea(0x00aaef12))
  }

  public static getInstance(): ChunkGenerator {
    if (!ChunkGenerator.instance) {
      ChunkGenerator.instance = new ChunkGenerator()
    }

    return ChunkGenerator.instance
  }

  private setCellType(cell: Tile, noise: number) {
    const max_water_level = 0
    const max_sand_level = 0.6
    const max_grass_level = 0.8

    if (noise >= max_water_level && noise < max_sand_level) {
      cell.addTag('shore')
    } else if (noise >= max_sand_level && noise < max_grass_level) {
      cell.addTag('plain')
    } else if (noise >= max_grass_level) {
      cell.addTag('hill')
    } else {
      cell.addTag('water')
    }
  }

  public generateChunk(chunk: Chunk) {
    for (const cell of chunk.tiles) {
      const { x, y } = cell
      const nX = (chunk.chunkPosition.x * Constants.ChunkSize + x) / 256
      const nY = (chunk.chunkPosition.y * Constants.ChunkSize + y) / 256
      const d = Math.min(1, (nX ** 2 + nY ** 2) / Math.sqrt(0.5))
      let e =
        this.generateNoise(nX, nY) +
        0.5 * this.generateNoise(2 * nX, 2 * nY) +
        0.25 * this.generateNoise(4 * nX, 4 * nY)
      e = (e + (1 - d)) / 2
      const noise = Math.pow(e, 0.2)
      this.setCellType(cell, noise)
    }
  }
}
