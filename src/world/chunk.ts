import { Engine, PolygonCollider, SpriteSheet, TileMap, vec, Vector } from 'excalibur'
import { ChunkGenerator, ChunkWithPosition } from './chunkGenerator'
import { Resources } from '../resources'
import { Constants } from '../constants'

interface ChunkOptions {
  pos: Vector
}

export class Chunk extends TileMap implements ChunkWithPosition {
  public readonly chunkPosition: Vector
  private readonly sheet: SpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.Terrain,
    grid: {
      spriteWidth: Constants.SpriteSize,
      spriteHeight: Constants.SpriteSize,
      rows: 12,
      columns: 17,
    },
  })

  constructor(options: ChunkOptions) {
    super({
      columns: Constants.ChunkSize,
      rows: Constants.ChunkSize,
      tileHeight: Constants.SpriteSize,
      tileWidth: Constants.SpriteSize,
    })
    this.chunkPosition = options.pos
  }

  onInitialize(_engine: Engine) {
    super.onInitialize(_engine)
    const generator = ChunkGenerator.getInstance()
    generator.generateChunk(this)
    for (const cell of this.tiles) {
      cell.addCollider(
        new PolygonCollider({
          points: [
            vec(0, 0),
            vec(Constants.SpriteSize, 0),
            vec(Constants.SpriteSize, -Constants.SpriteSize),
            vec(0, -Constants.SpriteSize),
          ],
        }),
      )
      if (cell.hasTag('water')) {
        cell.addGraphic(this.sheet.getSprite(16, 11))
      }
      if (cell.hasTag('hill')) {
        cell.addGraphic(this.sheet.getSprite(11, 1))
      }
      if (cell.hasTag('plain')) {
        cell.addGraphic(this.sheet.getSprite(6, 1))
      }
      if (cell.hasTag('shore')) {
        cell.addGraphic(this.sheet.getSprite(1, 1))
      }
    }
  }
}
