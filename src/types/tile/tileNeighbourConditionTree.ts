import { Sprite } from 'excalibur'

export type TileNeighbours = {
  east: string
  west: string
  north: string
  south: string
}

export type TileNeighbourCondition = {
  conditions: TileNeighbours
  sprite: Sprite
}

export type TileNeighbourConditionTree = TileNeighbourCondition[]
