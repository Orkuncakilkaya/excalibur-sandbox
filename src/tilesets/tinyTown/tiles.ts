import { GroundTileType, WorldTile } from '../../types/tile/tile'

export const PlainTile: WorldTile = {
  type: GroundTileType.Plain,
  posX: 0,
  posY: 0,
  rules: [],
}
export const HillTile: WorldTile = {
  type: GroundTileType.Hill,
  posX: 1,
  posY: 11,
  rules: [],
}
export const SandTile: WorldTile = {
  type: GroundTileType.Shore,
  posX: 1,
  posY: 2,
  rules: [
    {
      conditions: {
        east: GroundTileType.Shore,
        west: GroundTileType.Plain,
        north: GroundTileType.Plain,
        south: GroundTileType.Shore,
      },
      posX: 0,
      posY: 1,
    },
    {
      conditions: {
        east: GroundTileType.Shore,
        west: GroundTileType.Shore,
        north: GroundTileType.Plain,
        south: GroundTileType.Shore,
      },
      posX: 1,
      posY: 1,
    },
    {
      conditions: {
        east: GroundTileType.Plain,
        west: GroundTileType.Shore,
        north: GroundTileType.Plain,
        south: GroundTileType.Shore,
      },
      posX: 2,
      posY: 1,
    },
    {
      conditions: {
        east: GroundTileType.Shore,
        west: GroundTileType.Plain,
        north: GroundTileType.Shore,
        south: GroundTileType.Shore,
      },
      posX: 0,
      posY: 2,
    },
    {
      conditions: {
        east: GroundTileType.Shore,
        west: GroundTileType.Plain,
        north: GroundTileType.Shore,
        south: GroundTileType.Plain,
      },
      posX: 0,
      posY: 3,
    },
    {
      conditions: {
        east: GroundTileType.Shore,
        west: GroundTileType.Shore,
        north: GroundTileType.Shore,
        south: GroundTileType.Plain,
      },
      posX: 1,
      posY: 3,
    },
    {
      conditions: {
        east: GroundTileType.Plain,
        west: GroundTileType.Shore,
        north: GroundTileType.Shore,
        south: GroundTileType.Plain,
      },
      posX: 2,
      posY: 3,
    },
    {
      conditions: {
        east: GroundTileType.Plain,
        west: GroundTileType.Shore,
        north: GroundTileType.Shore,
        south: GroundTileType.Shore,
      },
      posX: 2,
      posY: 2,
    },
    {
      conditions: {
        east: GroundTileType.Plain,
        west: GroundTileType.Shore,
        north: GroundTileType.Plain,
        south: GroundTileType.Shore,
      },
      posX: 2,
      posY: 1,
    },
  ],
}
