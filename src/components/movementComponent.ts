import { Component } from 'excalibur'
import { LookDirection, MovementType } from '../utils/position'

export class MovementComponent extends Component {
  readonly type = 'movement'
  speed: number
  oldDirection: LookDirection = LookDirection.South
  oldMovement: MovementType = MovementType.Idle
  movement: MovementType = this.oldMovement
  direction: LookDirection = this.oldDirection

  constructor(speed: number) {
    super()
    this.speed = speed
  }
}
