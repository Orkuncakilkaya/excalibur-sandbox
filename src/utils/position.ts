import { vec } from 'excalibur'
import { Constants } from '../constants'

export const globalPositionToChunkPosition = (globalX: number, globalY: number) => {
  return vec(
    Math.floor(globalX / (Constants.ChunkSize * Constants.SpriteSize)),
    Math.floor(globalY / (Constants.ChunkSize * Constants.SpriteSize)),
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
