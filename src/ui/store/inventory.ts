import { readable } from 'svelte/store'
import { onInventoryStateChanged } from '../events/inventoryState'

export const inventoryStore = readable({ weight: 0, container: [], maxWeight: 500 }, (set) => {
  onInventoryStateChanged(function (event) {
    set(event.detail)
  })
})
