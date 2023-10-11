import { Player } from './player'
import { Actor, Color, Engine, Rectangle, Tile, vec } from 'excalibur'
import { directionToVector, globalPositionToChunkPosition } from '../utils/position'
import { WorldManager } from '../world/worldManager'
import { Constants } from '../constants'
import { Action } from '../types/events/actionEvents'
import { GlobalEvents } from '../utils/globalEvents'
import { MovementComponent } from '../components/movementComponent'

export class Cursor extends Actor {
  protected player: Player
  protected world: WorldManager
  protected collisions: Actor[] = []
  protected bus: GlobalEvents = GlobalEvents.getInstance()
  protected selectedTile: Tile
  protected maxOffset = vec(3, 3)
  protected minOffset = vec(-3, -3)
  protected offset = vec(0, 0)
  protected mouseOffset = vec(0, 0)
  protected mouseDistance = 5

  constructor(player: Player) {
    super()
    this.player = player
    this.world = WorldManager.getInstance()
  }

  onInitialize(_engine: Engine) {
    super.onInitialize(_engine)
    this.z = 10
    const rect = new Rectangle({
      width: Constants.TileSize,
      height: Constants.TileSize,
      color: Color.fromHex('#ffffff55'),
    })
    this.graphics.use(rect)
    this.collider.useBoxCollider(Constants.TileSize, Constants.TileSize)
    this.on('collisionstart', (event) => {
      if (!event.other.hasTag('player')) {
        this.collisions.push(event.other)
      }
    })
    this.on('collisionend', (event) => {
      this.collisions = this.collisions.filter((t) => t !== event.other)
    })
    this.bus.emitter.on('onAction', ({ action }) => {
      if (action === Action.OnHoldAction) {
        if (this.collisions.length) {
          const target = this.collisions[0]
          if (target.hasTag('tree')) {
            target.kill()
            console.log('tree collected')
          }
        }
      }
    })
    this.bus.emitter.on('onAction', ({ action, options }) => {
      if (action === Action.ChangeOffset && options.offsetDirection) {
        const newOffset = this.offset.clone().add(options.offsetDirection)
        if (
          newOffset.x <= this.maxOffset.x &&
          newOffset.x >= this.minOffset.x &&
          newOffset.y <= this.maxOffset.y &&
          newOffset.y >= this.minOffset.y
        ) {
          this.offset = newOffset
          this.mouseOffset = vec(0, 0)
        }
      }
      if (action === Action.ReplaceOffset && options.offsetDirection) {
        this.mouseOffset = vec(options.offsetDirection.x, options.offsetDirection.y)
      }
    })
  }

  onPostUpdate(_engine: Engine, _delta: number) {
    super.onPostUpdate(_engine, _delta)

    const movement = this.player.get<MovementComponent>(MovementComponent)

    const playerPos = this.player.pos.clone()
    const playerDirection = movement.direction
    const playerDirectionVector = directionToVector(playerDirection)
    playerDirectionVector.setTo(
      playerDirectionVector.x * Constants.TileSize,
      playerDirectionVector.y * Constants.TileSize,
    )
    const playerTarget = playerDirectionVector.clone().add(playerPos)
    const playerChunk = this.world.findOrCreateChunk(globalPositionToChunkPosition(playerTarget.x, playerTarget.y))
    const tile = playerChunk.getTileByPoint(playerTarget)
    if (tile) {
      this.selectedTile = tile
      this.pos = tile.pos
        .clone()
        .add(vec(Constants.TileSize / 2, Constants.TileSize / 2))
        .add(vec(this.offset.x * Constants.TileSize, this.offset.y * Constants.TileSize))
      if (this.mouseOffset.x !== 0 && this.mouseOffset.y !== 0) {
        const chunkPosition = globalPositionToChunkPosition(this.mouseOffset.x, this.mouseOffset.y)
        const targetChunk = this.world.findOrCreateChunk(chunkPosition)
        const mouseTargetTile = targetChunk.getTileByPoint(this.mouseOffset)
        if (mouseTargetTile) {
          const targetPos = vec(mouseTargetTile.pos.x, mouseTargetTile.pos.y).add(
            vec(Constants.TileSize / 2, Constants.TileSize / 2),
          )
          if (Math.abs(targetPos.distance(this.player.pos)) <= this.mouseDistance * Constants.TileSize) {
            this.pos = targetPos
          }
        }
      }
    } else {
      this.pos = playerTarget
    }
  }
}
