import { Circle, Color, Engine, Font, PolygonCollider, SpriteSheet, Text, TileMap, vec, Vector } from 'excalibur'
import { ChunkGenerator, ChunkWithPosition } from './chunkGenerator'
import { Resources } from '../resources'
import { Constants } from '../constants'
import { Tree } from '../actors/tree'
import { TileNeighbourConditionTree } from '../types/tile/tileNeighbourConditionTree'
import { getConditionalSprite, getTileNeighbours } from '../utils/getTileNeighbours'

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
    this.generateTiles()
  }

  protected generateTiles() {
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

      const shoreRules: TileNeighbourConditionTree = [
        {
          conditions: {
            east: 'shore',
            west: 'plain',
            north: 'plain',
            south: 'shore',
          },
          sprite: this.townSheet.getSprite(0, 1),
        },
        {
          conditions: {
            east: 'shore',
            west: 'shore',
            north: 'plain',
            south: 'shore',
          },
          sprite: this.townSheet.getSprite(1, 1),
        },
        {
          conditions: {
            east: 'plain',
            west: 'shore',
            north: 'plain',
            south: 'shore',
          },
          sprite: this.townSheet.getSprite(2, 1),
        },
        {
          conditions: {
            east: 'shore',
            west: 'plain',
            north: 'shore',
            south: 'shore',
          },
          sprite: this.townSheet.getSprite(0, 2),
        },
        {
          conditions: {
            east: 'shore',
            west: 'plain',
            north: 'shore',
            south: 'plain',
          },
          sprite: this.townSheet.getSprite(0, 3),
        },
        {
          conditions: {
            east: 'shore',
            west: 'shore',
            north: 'shore',
            south: 'plain',
          },
          sprite: this.townSheet.getSprite(1, 3),
        },
        {
          conditions: {
            east: 'plain',
            west: 'shore',
            north: 'shore',
            south: 'plain',
          },
          sprite: this.townSheet.getSprite(2, 3),
        },
        {
          conditions: {
            east: 'plain',
            west: 'shore',
            north: 'shore',
            south: 'shore',
          },
          sprite: this.townSheet.getSprite(2, 2),
        },
        {
          conditions: {
            east: 'plain',
            west: 'shore',
            north: 'plain',
            south: 'shore',
          },
          sprite: this.townSheet.getSprite(2, 1),
        },
      ]

      const neighbours = getTileNeighbours(cell)

      if (cell.data.get('type') === 'water') {
        cell.addGraphic(this.battleSheet.getSprite(1, 2))
      }
      if (cell.data.get('type') === 'hill') {
        cell.addGraphic(this.townSheet.getSprite(1, 11))
      }
      if (cell.data.get('type') === 'plain') {
        cell.addGraphic(this.townSheet.getSprite(0, 0))
      }
      if (cell.data.get('type') === 'shore') {
        const sprite = getConditionalSprite(neighbours, shoreRules, this.townSheet.getSprite(1, 2))
        cell.addGraphic(sprite)
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
