export enum Action {
  Interact,
  Attack,
  Block,
  Drop,
}

export class ActionEvent {
  protected readonly _action: Action

  constructor(action: Action) {
    this._action = action
  }

  get action() {
    return this._action
  }
}

export type ActionEvents = {
  onAction: ActionEvent
}
