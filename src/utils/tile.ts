import { GroundTileType, TileNeighbours, TileRules, TileSet, TileSpritePosition } from '../types/tile/tile'
import { Sprite, Tile } from 'excalibur'
import { Chunk } from '../world/chunk'
import { ChunkGenerator } from '../world/chunkGenerator'

interface SpriteFinderOptions {
  tileSet: TileSet
  type: GroundTileType
}

interface ConditionForFinderOptions {
  neighbours: TileNeighbours
}

const conditionCache: Map<string, Sprite> = new Map<string, Sprite>()

const findTile = ({ tileSet, type }: SpriteFinderOptions) => {
  return tileSet.tiles.find((t) => t.type === type)
}

export const getSpriteFromTileSet = ({ tileSet, type }: SpriteFinderOptions) => {
  const tile = findTile({ tileSet, type })
  if (!tile) {
    return tileSet.sheet.getSprite(-1, -1)
  }

  return tileSet.sheet.getSprite(tile.posX, tile.posY)
}

export const getTileNeighbours = (tile: Tile): TileNeighbours => {
  const chunk = tile.map as Chunk
  const generator = ChunkGenerator.getInstance()

  return {
    east: generator.getTileType(tile.x + 1, tile.y, chunk.chunkPosition) as GroundTileType,
    west: generator.getTileType(tile.x - 1, tile.y, chunk.chunkPosition) as GroundTileType,
    south: generator.getTileType(tile.x, tile.y + 1, chunk.chunkPosition) as GroundTileType,
    north: generator.getTileType(tile.x, tile.y - 1, chunk.chunkPosition) as GroundTileType,
  }
}

const getConditionalSpritePosition = (
  neighbours: TileNeighbours,
  ruleTree: TileRules,
  defaultPosition: TileSpritePosition,
): TileSpritePosition => {
  const target = ruleTree.find((t) => {
    return (
      t.conditions.east === neighbours.east &&
      t.conditions.west === neighbours.west &&
      t.conditions.north === neighbours.north &&
      t.conditions.south === neighbours.south
    )
  })
  if (target) {
    return { posX: target.posX, posY: target.posY }
  }
  return defaultPosition
}

export const getConditionalSpriteFromTileSet = ({
  tileSet,
  type,
  neighbours,
}: SpriteFinderOptions & ConditionForFinderOptions) => {
  const neighboursCacheKey = `${neighbours.east}-${neighbours.west}-${neighbours.north}-${neighbours.south}`
  const cacheKey = `${tileSet.name}-${type}-${neighboursCacheKey}`
  if (conditionCache.has(cacheKey)) {
    return conditionCache.get(cacheKey)
  }
  const tile = findTile({ tileSet, type })
  if (!tile) {
    return tileSet.sheet.getSprite(-1, -1)
  }

  const position = getConditionalSpritePosition(neighbours, tile.rules, { posX: tile.posX, posY: tile.posY })
  const sprite = tileSet.sheet.getSprite(position.posX, position.posY)
  conditionCache.set(cacheKey, sprite)

  return sprite
}
