import { dispatchEvent } from './utils'
export enum GameScreen {
  Loading = 'loading',
  MainMenu = 'mainMenu',
  HUD = 'hud',
  Pause = 'pause',
}
export type UIStateUpdatedEvent = {
  screen: GameScreen
}

export const uiStateChanged = (detail: UIStateUpdatedEvent) =>
  dispatchEvent(new CustomEvent<UIStateUpdatedEvent>('UIStateUpdated', { detail }))

export const listenUIStateUpdated = (listener: (event: CustomEvent<UIStateUpdatedEvent>) => void) =>
  window.addEventListener('UIStateUpdated', listener)
