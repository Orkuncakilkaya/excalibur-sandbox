import { Component } from 'excalibur'
import { GatherableTypes } from '../types/gatherableTypes'

export class GatherableComponent extends Component {
  readonly type: string = 'resource'
  gatherableType: GatherableTypes

  constructor(gatherableType: GatherableTypes) {
    super()
    this.gatherableType = gatherableType
  }
}
