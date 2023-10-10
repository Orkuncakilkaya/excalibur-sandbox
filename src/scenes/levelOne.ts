import { Scene, vec } from 'excalibur'
import { WorldManager } from '../world/worldManager'
import { Player } from '../actors/player'
import { Cursor } from '../actors/cursor'
import { MovementSystem } from '../systems/movementSystem'
import { AnimationSystem } from '../systems/animationSystem'
import { ExploringSystem } from '../systems/exploringSystem'
import { PlayerControllerSystem } from '../systems/playerControllerSystem'
import { GlobalEvents } from '../utils/globalEvents'
import { Action } from '../types/events/actionEvents'
import { Tree } from '../actors/tree'

/**
 * Managed scene
 */
export class LevelOne extends Scene {
  protected bus: GlobalEvents = GlobalEvents.getInstance()

  public onInitialize() {
    const world = WorldManager.getInstance(this)
    const player = new Player()
    this.add(player)
    const cursor = new Cursor(player)
    this.camera.strategy.lockToActor(player)
    this.camera.zoom = 2
    this.add(cursor)
    this.world.add(new MovementSystem())
    this.world.add(new AnimationSystem())
    this.world.add(new ExploringSystem())
    this.world.add(new PlayerControllerSystem())
    const chunk = world.findOrCreateChunk(vec(0, 0))
    chunk.addChild(new Tree())
    this.bus.emitter.on('onAction', (event) => {
      if (event.action === Action.SaveWorld) {
        console.log(this.entities)
      }
    })
  }

  public onActivate() {}

  public onDeactivate() {}
}
