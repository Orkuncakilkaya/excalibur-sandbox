import { Animation, Component } from 'excalibur'

export type Animations = {
  [key: number]: Animation
}

export class AnimationComponent extends Component {
  readonly type = 'animation'
  idleAnimations: Animations
  walkingAnimations: Animations

  constructor({ idleAnimations, walkingAnimations }: { idleAnimations: Animations; walkingAnimations: Animations }) {
    super()
    this.idleAnimations = idleAnimations
    this.walkingAnimations = walkingAnimations
  }
}
