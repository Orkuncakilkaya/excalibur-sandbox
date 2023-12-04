import { Component } from 'excalibur'
import { ItemComponent } from './itemComponent'
import { dispatchInventoryState } from '../ui/events/inventoryState'
import { Items, Recipes } from '../resources'
import { onCraft } from '../ui/events/craftState'

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

    onCraft((event) => {
      this.craft(Items[event.detail.item])
    })
  }

  canPushItem(item: ItemComponent) {
    return item.weight * item.stack <= this.maxWeight - this.weight
  }

  canPushAllItems(items: ItemComponent[]) {
    const weight = items.reduce((acc, item) => acc + item.weight * item.stack, 0)
    return weight <= this.maxWeight - this.weight
  }

  canCraft(item: ItemComponent) {
    console.log(item)
    if (item.name in Recipes) {
      const container = JSON.parse(JSON.stringify(this.container)) as ItemComponent[]
      const recipe = Recipes[item.name]
      return recipe.every((recipeItem) => {
        return (
          container.filter((t) => t.name === recipeItem.name).reduce((acc, item) => acc + item.stack, 0) >=
          recipeItem.stack
        )
      })
    }

    return false
  }

  removeRecipeItems(item: ItemComponent) {
    if (item.name in Recipes) {
      const recipe = Recipes[item.name]
      recipe.forEach((recipeItem) => {
        this.removeItems(recipeItem.name, recipeItem.stack)
      })
    }
  }

  removeItems(name: string, stack: number) {
    const container = JSON.parse(JSON.stringify(this.container)) as ItemComponent[]
    let remaining = stack
    for (let i = container.length - 1; i >= 0; i--) {
      if (container[i].name === name) {
        const remove = Math.min(container[i].stack, remaining)
        container[i].stack -= remove
        remaining -= remove

        // Remove the item if the stack is 0 or less
        if (container[i].stack <= 0) {
          container.splice(i, 1)
        }

        // Stop if we have removed the required quantity
        if (remaining <= 0) {
          break
        }
      }
    }

    this.container = container
  }

  craft(item: ItemComponent) {
    if (this.canCraft(item)) {
      this.removeRecipeItems(item)
      this.pushItem(item)
    }
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
