import { SpriteSheet } from 'excalibur'

export type TileNeighbours = {
  east: GroundTileType
  west: GroundTileType
  north: GroundTileType
  south: GroundTileType
}

export type TileSpritePosition = {
  posX: number
  posY: number
}

export type TileRule = {
  conditions: TileNeighbours
} & TileSpritePosition

export type TileRules = TileRule[]

export enum GroundTileType {
  Water = 'water',
  Shore = 'shore',
  Plain = 'plain',
  Hill = 'hill',
}

export type WorldTile = {
  type: GroundTileType | string
  rules: TileRules
} & TileSpritePosition

export type TileSet = {
  name: string
  tiles: WorldTile[]
  sheet: SpriteSheet
}
