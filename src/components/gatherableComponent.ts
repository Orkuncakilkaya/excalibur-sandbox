import { Component } from 'excalibur'
import { ItemComponent } from './itemComponent'

export class GatherableComponent extends Component {
  readonly type: string = 'resource'
  items: ItemComponent[] = []

  constructor(items: ItemComponent[]) {
    super()
    this.items = items
  }
}
