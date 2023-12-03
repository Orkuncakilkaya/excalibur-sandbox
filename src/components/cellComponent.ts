import { Component, Tile } from 'excalibur'

export class CellComponent extends Component {
  readonly type: string = 'cell'
  cell: Tile = null

  constructor(cell: Tile) {
    super()
    this.cell = cell
  }
}
