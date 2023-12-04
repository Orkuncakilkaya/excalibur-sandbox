import { Component } from 'excalibur'

type ItemOptions = {
  name: string
  label: string
  weight: number
  isStackable: boolean
  maxStackCount: number
  isConsumable: boolean
  isEquipment: boolean
  hasDurability: boolean
  maxDurability: number
  durability: number
  stack: number
}

export class ItemComponent extends Component {
  readonly type: string = 'item'
  name: string
  label: string
  weight: number = 1
  isStackable: boolean = true
  maxStackCount: number = 200
  isConsumable: boolean = false
  isEquipment: boolean = false
  hasDurability: boolean = false
  maxDurability: number = 100
  durability: number = 100
  stack: number = 1

  constructor({
    durability,
    hasDurability,
    maxDurability,
    maxStackCount,
    stack,
    isConsumable,
    isEquipment,
    label,
    name,
    weight,
    isStackable,
  }: ItemOptions) {
    super()
    this.durability = durability
    this.hasDurability = hasDurability
    this.maxDurability = maxDurability
    this.maxStackCount = maxStackCount
    this.stack = stack
    this.isConsumable = isConsumable
    this.isEquipment = isEquipment
    this.label = label
    this.name = name
    this.weight = weight
    this.isStackable = isStackable
  }
}
