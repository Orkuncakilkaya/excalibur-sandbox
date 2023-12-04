import { dispatchEvent } from './utils'

export type CraftState = {
  item: string
}

export const dispatchCraftItem = (detail: CraftState) => {
  dispatchEvent(new CustomEvent<CraftState>('Craft', { detail }))
}

export const onCraft = (listener: (event: CustomEvent<CraftState>) => void) =>
  window.addEventListener('Craft', listener)
