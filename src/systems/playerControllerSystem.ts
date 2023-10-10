import {
  ActionsComponent,
  Axes,
  Buttons,
  Component,
  EngineInput,
  Entity,
  Gamepad,
  Keys,
  Scene,
  System,
  SystemType,
  SystemTypes,
  vec,
  Vector,
} from 'excalibur'
import { GlobalEvents } from '../utils/globalEvents'
import { Action, ActionEvent } from '../types/events/actionEvents'
import { PlayerControllerComponent } from '../components/playerControllerComponent'
import { MovementComponent } from '../components/movementComponent'
import { Constants } from '../constants'

export class PlayerControllerSystem extends System {
  readonly systemType: SystemType = SystemType.Update
  readonly types: SystemTypes<Component>[] = ['playerController']
  private gamePad?: Gamepad
  private bus: GlobalEvents = GlobalEvents.getInstance()
  private input!: EngineInput

  initialize(scene: Scene) {
    this.input = scene.engine.input
    this.prepareGamepad()
  }

  update(entities: Entity[]): void {
    for (const entity of entities) {
      const component = entity.get<PlayerControllerComponent>(PlayerControllerComponent)
      const actions = entity.get<ActionsComponent>(ActionsComponent)
      const movement = entity.get<MovementComponent>(MovementComponent)

      let velocity: Vector = vec(0, 0)

      if (component && actions && movement && actions) {
        const queue = actions.getQueue()
        if (this.gamePad) {
          const queue = actions.getQueue()
          let x = this.gamePad.getAxes(Axes.LeftStickX)
          let y = this.gamePad.getAxes(Axes.LeftStickY)
          if (Math.abs(x) < component.gamepadDeadZone) {
            x = 0
          }
          if (Math.abs(y) < component.gamepadDeadZone) {
            y = 0
          }

          let nX = 0,
            nY = 0
          if (x < 0) {
            nX = -1
          }
          if (x > 0) {
            nX = 1
          }
          if (y < 0) {
            nY = -1
          }
          if (y > 0) {
            nY = 1
          }

          velocity = vec(nX, nY)
          if (queue.isComplete()) {
            actions.moveBy(vec(velocity.x * Constants.SpriteSize, velocity.y * Constants.SpriteSize), movement.speed)
          }
          if (this.gamePad.wasButtonPressed(Buttons.Face2)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.Drop))
          }
          if (this.gamePad.wasButtonPressed(Buttons.Face1)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.Interact))
          }
        }
        if (!this.gamePad) {
          velocity = vec(0, 0)
          if (this.input.keyboard.isHeld(Keys.W)) {
            velocity.y = -1
          }
          if (this.input.keyboard.isHeld(Keys.S)) {
            velocity.y = 1
          }
          if (this.input.keyboard.isHeld(Keys.A)) {
            velocity.x = -1
          }
          if (this.input.keyboard.isHeld(Keys.D)) {
            velocity.x = 1
          }
          if (queue.isComplete()) {
            actions.moveBy(vec(velocity.x * Constants.SpriteSize, velocity.y * Constants.SpriteSize), movement.speed)
          }
          if (this.input.keyboard.wasPressed(Keys.Q)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.Drop))
          }
          if (this.input.keyboard.wasPressed(Keys.E)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.Interact))
          }
          if (this.input.keyboard.wasPressed(Keys.R)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.SaveWorld))
          }
        }
      }
    }
  }

  private prepareGamepad() {
    const gamePads = this.input.gamepads
    gamePads.init()
    gamePads.on('connect', (event) => {
      this.gamePad = gamePads.at(event.index)
    })
    gamePads.on('disconnect', () => {
      this.gamePad = undefined
    })
  }
}
