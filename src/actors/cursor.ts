import { Player } from './player'
import { Actor, Color, Engine, Rectangle, Tile, vec } from 'excalibur'
import { directionToVector, globalPositionToChunkPosition } from '../utils/position'
import { WorldManager } from '../world/worldManager'
import { Constants } from '../constants'
import { Action } from '../types/events/actionEvents'
import { GlobalEvents } from '../utils/globalEvents'
import { MovementComponent } from '../components/movementComponent'
import { Tree } from './tree'

export class Cursor extends Actor {
  protected player: Player
  protected world: WorldManager
  protected collisions: Actor[] = []
  protected bus: GlobalEvents = GlobalEvents.getInstance()
  protected selectedTile: Tile

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
      if (action === Action.Drop && this.selectedTile) {
        const chunk = this.world.findOrCreateChunk(globalPositionToChunkPosition(this.pos.x, this.pos.y))
        const tree = new Tree()
        tree.pos.setTo(this.selectedTile.x * Constants.TileSize + 8, this.selectedTile.y * Constants.TileSize + 8)
        chunk.addChild(tree)
      }
      if (action === Action.Interact) {
        if (this.collisions.length) {
          const target = this.collisions[0]
          if (target.hasTag('tree')) {
            target.kill()
            console.log('tree collected')
          }
        }
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
      this.pos = tile.pos.clone().add(vec(Constants.TileSize / 2, Constants.TileSize / 2))
    } else {
      this.pos = playerTarget
    }
  }
}
