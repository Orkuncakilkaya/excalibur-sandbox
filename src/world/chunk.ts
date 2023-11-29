import { Engine, PolygonCollider, Tile, TileMap, vec, Vector } from 'excalibur'
import { ChunkGenerator, ChunkWithPosition } from './chunkGenerator'
import { Constants } from '../constants'
import { Tree } from '../actors/resources/tree'
import { GroundTileType } from '../types/tile/tile'
import { TinyBattleTileSet } from '../tilesets/tinyBattle/tileSet'
import { getConditionalSpriteFromTileSet, getSpriteFromTileSet, getTileNeighbours } from '../utils/tile'
import { TinyTownTileSet } from '../tilesets/tinyTown/tileSet'
import { Stone } from '../actors/resources/stone'

interface ChunkOptions {
  pos: Vector
}

export class Chunk extends TileMap implements ChunkWithPosition {
  public chunkPosition: Vector

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
  }

  generateTiles() {
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

      const neighbours = getTileNeighbours(cell)

      if (cell.data.get('type') === 'water') {
        cell.addGraphic(getSpriteFromTileSet({ tileSet: TinyBattleTileSet, type: GroundTileType.Water }))
      }
      if (cell.data.get('type') === 'hill') {
        cell.addGraphic(getSpriteFromTileSet({ tileSet: TinyTownTileSet, type: GroundTileType.Hill }))
      }
      if (cell.data.get('type') === 'plain') {
        cell.addGraphic(getSpriteFromTileSet({ tileSet: TinyTownTileSet, type: GroundTileType.Plain }))
      }
      if (cell.data.get('type') === 'shore') {
        cell.addGraphic(
          getConditionalSpriteFromTileSet({
            tileSet: TinyTownTileSet,
            type: GroundTileType.Shore,
            neighbours,
          }),
        )
      }
      this.generateResources(cell)
    }
  }

  protected generateResources(cell: Tile) {
    if (cell.hasTag('tree')) {
      const tree = new Tree(cell.pos.add(vec(-8, 0)))
      this.addChild(tree)
    }
    if (cell.hasTag('stone')) {
      const stone = new Stone(cell.pos.add(vec(-8, -8)))
      this.addChild(stone)
    }
  }
}
