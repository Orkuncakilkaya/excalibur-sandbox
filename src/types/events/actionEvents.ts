import { Vector } from 'excalibur'

export enum Action {
  Interact,
  OnHoldAction,
  Attack,
  Block,
  Drop,
  ChangeOffset,
  ReplaceOffset,
}

export interface ActionEventOptions {
  offsetDirection?: Vector
}

export class ActionEvent {
  protected readonly _action: Action
  protected readonly _options: ActionEventOptions

  constructor(action: Action, options?: ActionEventOptions) {
    this._action = action
    this._options = options
  }

  get action() {
    return this._action
  }

  get options() {
    return this._options
  }
}

export type ActionEvents = {
  onAction: ActionEvent
}
