import { vec, Vector } from 'excalibur'
import { Constants } from '../constants'

export const globalPositionToChunkPosition = (globalX: number, globalY: number) => {
  return vec(
    Math.floor(globalX / (Constants.ChunkSize * Constants.TileSize)),
    Math.floor(globalY / (Constants.ChunkSize * Constants.TileSize)),
  )
}

export enum LookDirection {
  North,
  NorthEast,
  East,
  SouthEast,
  South,
  SouthWest,
  West,
  NorthWest,
}

export enum MovementType {
  Moving,
  Idle,
}

export const directionToVector = (direction: LookDirection) => {
  switch (direction) {
    case LookDirection.East:
      return vec(1, 0)
    case LookDirection.North:
      return vec(0, -1)
    case LookDirection.NorthEast:
      return vec(1, 0)
    case LookDirection.NorthWest:
      return vec(-1, 0)
    case LookDirection.South:
      return vec(0, 1)
    case LookDirection.SouthEast:
      return vec(1, 0)
    case LookDirection.SouthWest:
      return vec(-1, 0)
    case LookDirection.West:
      return vec(-1, 0)
  }
}

export const vectorToDirection = (vector: Vector) => {
  if (vec(0, -1).distance(vector) === 0) {
    return LookDirection.North
  }
  if (vec(1, 0).distance(vector) === 0) {
    return LookDirection.East
  }
  if (vec(-1, 0).distance(vector) === 0) {
    return LookDirection.West
  }
  if (vec(0, 1).distance(vector) === 0) {
    return LookDirection.South
  }
  if (vec(1, 1).distance(vector) === 0) {
    return LookDirection.SouthEast
  }
  if (vec(-1, -1).distance(vector) === 0) {
    return LookDirection.SouthWest
  }
  if (vec(-1, -1).distance(vector) === 0) {
    return LookDirection.NorthWest
  }
  if (vec(1, -1).distance(vector) === 0) {
    return LookDirection.NorthEast
  }
  return LookDirection.South
}

export const compassToDirection = (compass: number): LookDirection => {
  switch (compass) {
    case 0:
      return LookDirection.East
    case 1:
      return LookDirection.NorthEast
    case 2:
      return LookDirection.South
    case 3:
      return LookDirection.NorthWest
    case 4:
      return LookDirection.West
    case 5:
      return LookDirection.SouthWest
    case 6:
      return LookDirection.North
    case 7:
      return LookDirection.SouthEast
  }

  return LookDirection.South
}
