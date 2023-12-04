import { ItemComponent } from '../../components/itemComponent'
import { dispatchEvent } from './utils'

export type InventoryStateUpdatedEvent = {
  weight: number
  container: ItemComponent[]
  maxWeight: number
}

export const dispatchInventoryState = (detail: InventoryStateUpdatedEvent) => {
  dispatchEvent(new CustomEvent<InventoryStateUpdatedEvent>('InventoryStateUpdated', { detail }))
}

export const onInventoryStateChanged = (listener: (event: CustomEvent<InventoryStateUpdatedEvent>) => void) =>
  window.addEventListener('InventoryStateUpdated', listener)
