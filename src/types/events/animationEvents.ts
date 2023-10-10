import { LookDirection, MovementType } from '../../utils/position'

export class AnimationChangedEvent {
  protected readonly _direction: LookDirection
  protected readonly _movementType: MovementType

  constructor(movementType: MovementType, direction: LookDirection) {
    this._movementType = movementType
    this._direction = direction
  }

  get movementType() {
    return this._movementType
  }

  get direction() {
    return this._direction
  }
}

export type AnimationEvents = {
  animationChanged: AnimationChangedEvent
}
