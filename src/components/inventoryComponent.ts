import { Component } from 'excalibur'
import { ItemComponent } from './itemComponent'
import { dispatchInventoryState } from '../ui/events/inventoryState'

type NewInventoryOptions = {
  maxWeight: number
  weight: number
  container: ItemComponent[]
}

export class InventoryComponent extends Component {
  readonly type: string = 'inventory'
  maxWeight: number
  weight: number
  container: ItemComponent[]

  constructor({ maxWeight, weight, container }: NewInventoryOptions = { maxWeight: 100, weight: 0, container: [] }) {
    super()
    this.maxWeight = maxWeight
    this.container = container
    this.weight = weight
    const timeout = setTimeout(() => {
      dispatchInventoryState({ maxWeight, weight, container })
      clearTimeout(timeout)
    })
  }

  canPushItem(item: ItemComponent) {
    return item.weight * item.stack <= this.maxWeight - this.weight
  }

  canPushAllItems(items: ItemComponent[]) {
    const weight = items.reduce((acc, item) => acc + item.weight * item.stack, 0)
    return weight <= this.maxWeight - this.weight
  }

  pushItem(item: ItemComponent) {
    if (this.canPushItem(item)) {
      if (item.isStackable) {
        const slot = this.container.find((t) => t.name === item.name && t.maxStackCount >= t.stack + item.stack)
        if (slot) {
          slot.stack = item.stack + slot.stack
        } else {
          this.container.push(item)
        }
      } else {
        this.container.push(item)
      }
    }
    this.weight = this.container.reduce((acc, item) => acc + item.stack * item.weight, 0)
    dispatchInventoryState({
      container: this.container,
      weight: this.weight,
      maxWeight: this.maxWeight,
    })
  }
}
