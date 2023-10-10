import { Engine, PolygonCollider, SpriteSheet, TileMap, vec, Vector } from 'excalibur'
import { ChunkGenerator, ChunkWithPosition } from './chunkGenerator'
import { Resources } from '../resources'
import { Constants } from '../constants'
import { Tree } from '../actors/tree'

interface ChunkOptions {
  pos: Vector
}

export class Chunk extends TileMap implements ChunkWithPosition {
  public readonly chunkPosition: Vector
  private readonly battleSheet: SpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.tinyBattle,
    grid: {
      spriteWidth: Constants.TileSize,
      spriteHeight: Constants.TileSize,
      rows: 11,
      columns: 19,
    },
  })
  private readonly townSheet: SpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.tinyTown,
    grid: {
      spriteWidth: Constants.TileSize,
      spriteHeight: Constants.TileSize,
      rows: 12,
      columns: 11,
    },
  })

  constructor(options: ChunkOptions) {
    super({
      columns: Constants.ChunkSize,
      rows: Constants.ChunkSize,
      tileHeight: Constants.TileSize,
      tileWidth: Constants.TileSize,
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
            vec(Constants.TileSize, 0),
            vec(Constants.TileSize, -Constants.TileSize),
            vec(0, -Constants.TileSize),
          ],
        }),
      )
      if (cell.hasTag('water')) {
        cell.addGraphic(this.battleSheet.getSprite(1, 2))
      }
      if (cell.hasTag('hill')) {
        cell.addGraphic(this.townSheet.getSprite(1, 11))
      }
      if (cell.hasTag('plain')) {
        cell.addGraphic(this.townSheet.getSprite(0, 0))
      }
      if (cell.hasTag('shore')) {
        cell.addGraphic(this.townSheet.getSprite(1, 2))
      }
      if (!this.isInitialized) {
        if (cell.hasTag('tree')) {
          const tree = new Tree(cell.pos.add(vec(8, 8)))
          this.addChild(tree)
        }
      }
    }
  }
}
