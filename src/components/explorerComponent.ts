import { Component, vec, Vector } from 'excalibur'

export class ExplorerComponent extends Component {
  readonly type: string = 'explorer'
  chunkPosition: Vector = vec(0, 0)
}
