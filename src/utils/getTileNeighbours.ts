import { Sprite, Tile } from 'excalibur'
import { TileNeighbours, TileNeighbourConditionTree } from '../types/tile/tileNeighbourConditionTree'
import { ChunkGenerator } from '../world/chunkGenerator'
import { Chunk } from '../world/chunk'

export const getTileNeighbours = (tile: Tile): TileNeighbours => {
  const chunk = tile.map as Chunk
  const generator = ChunkGenerator.getInstance()

  return {
    east: generator.getTileType(tile.x + 1, tile.y, chunk.chunkPosition),
    west: generator.getTileType(tile.x - 1, tile.y, chunk.chunkPosition),
    south: generator.getTileType(tile.x, tile.y + 1, chunk.chunkPosition),
    north: generator.getTileType(tile.x, tile.y - 1, chunk.chunkPosition),
  }
}

export const getConditionalSprite = (
  neighbours: TileNeighbours,
  ruleTree: TileNeighbourConditionTree,
  defaultSprite: Sprite,
): Sprite => {
  const target = ruleTree.find((t) => {
    return (
      t.conditions.east === neighbours.east &&
      t.conditions.west === neighbours.west &&
      t.conditions.north === neighbours.north &&
      t.conditions.south === neighbours.south
    )
  })
  if (target) {
    return target.sprite
  }
  return defaultSprite
}
