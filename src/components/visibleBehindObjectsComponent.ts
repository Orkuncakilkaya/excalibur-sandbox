import { Actor, Component } from 'excalibur'

export class VisibleBehindObjectsComponent extends Component {
  readonly type: string = 'visibleBehindObjects'
  toBeOpaque: Actor[] = []
}
