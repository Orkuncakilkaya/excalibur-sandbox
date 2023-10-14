import {
  ActionsComponent,
  Axes,
  BoundingBox,
  Buttons,
  ColliderComponent,
  Component,
  EngineInput,
  Entity,
  Gamepad,
  Keys,
  PointerButton,
  Scene,
  System,
  SystemType,
  SystemTypes,
  TransformComponent,
  vec,
  Vector,
} from 'excalibur'
import { GlobalEvents } from '../utils/globalEvents'
import { Action, ActionEvent } from '../types/events/actionEvents'
import { PlayerControllerComponent } from '../components/playerControllerComponent'
import { MovementComponent } from '../components/movementComponent'
import { Constants } from '../constants'
import { globalPositionToChunkPosition, vectorToDirection } from '../utils/position'
import { WorldManager } from '../world/worldManager'

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
    const world = WorldManager.getInstance()
    for (const entity of entities) {
      const component = entity.get<PlayerControllerComponent>(PlayerControllerComponent)
      const actions = entity.get<ActionsComponent>(ActionsComponent)
      const movement = entity.get<MovementComponent>(MovementComponent)
      const transform = entity.get<TransformComponent>(TransformComponent)

      let velocity: Vector = vec(0, 0)

      if (component && actions && movement && actions && transform) {
        const queue = actions.getQueue()
        if (this.gamePad) {
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
          if (this.input.keyboard.wasPressed(Keys.Up)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.ChangeOffset, { offsetDirection: Vector.Up }))
          }
          if (this.input.keyboard.wasPressed(Keys.Right)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.ChangeOffset, { offsetDirection: Vector.Right }))
          }
          if (this.input.keyboard.wasPressed(Keys.Left)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.ChangeOffset, { offsetDirection: Vector.Left }))
          }
          if (this.input.keyboard.wasPressed(Keys.Down)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.ChangeOffset, { offsetDirection: Vector.Down }))
          }
          if (this.input.keyboard.wasPressed(Keys.Q)) {
            this.bus.emitter.emit('onAction', new ActionEvent(Action.Drop))
          }
          if (this.input.keyboard.wasPressed(Keys.E)) {
            if (!component.keyHold[Keys.E]) {
              component.keyHold[Keys.E] = {}
            }
            component.keyHold[Keys.E].start = Date.now()
            this.bus.emitter.emit('onAction', new ActionEvent(Action.Interact))
          }
          if (this.input.keyboard.isHeld(Keys.E)) {
            if (component.keyHold[Keys.E].start !== 0) {
              const now = Date.now()
              if (now - component.keyHold[Keys.E].start > 500) {
                component.keyHold[Keys.E].start = 0
                this.bus.emitter.emit('onAction', new ActionEvent(Action.OnHoldAction))
              }
            }
          }
          const mouseWorldPosition = this.input.pointers.currentFramePointerCoords.get(0)?.worldPos
          if (mouseWorldPosition && this.input.pointers.isDown(0)) {
            this.bus.emitter.emit(
              'onAction',
              new ActionEvent(Action.ReplaceOffset, { offsetDirection: mouseWorldPosition }),
            )
          }
        }

        if (queue.isComplete() && velocity.distance(vec(0, 0)) > 0) {
          let tileIsFree = true
          const nextPosition = vec(
            transform.pos.x + velocity.x * Constants.TileSize,
            transform.pos.y + velocity.y * Constants.TileSize,
          )
          const nextBounding = new BoundingBox({
            top: nextPosition.y,
            left: nextPosition.x,
            right: nextPosition.x + Constants.TileSize - 8,
            bottom: nextPosition.y + Constants.TileSize - 8,
          })
          const nextChunkPosition = globalPositionToChunkPosition(nextPosition.x, nextPosition.y)
          const chunk = world.findOrCreateChunk(nextChunkPosition)
          for (const child of chunk.children) {
            if (child.hasTag('solid')) {
              const collider = child.get<ColliderComponent>(ColliderComponent)
              if (collider.bounds.overlaps(nextBounding)) {
                tileIsFree = false
                break
              }
            }
          }
          if (tileIsFree) {
            actions.moveBy(vec(velocity.x * Constants.TileSize, velocity.y * Constants.TileSize), movement.speed)
          } else {
            const dir = vectorToDirection(velocity)
            movement.oldDirection = dir
            movement.direction = dir
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
