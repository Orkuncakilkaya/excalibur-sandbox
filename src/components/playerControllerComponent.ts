import { Component } from 'excalibur'

export class PlayerControllerComponent extends Component {
  readonly type = 'playerController'
  gamepadDeadZone: number = 0.4
}
