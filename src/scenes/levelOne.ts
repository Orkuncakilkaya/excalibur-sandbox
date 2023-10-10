import { Scene } from 'excalibur'
import { WorldManager } from '../world/worldManager'
import { Player } from '../actors/player'
import { Cursor } from '../actors/cursor'
import { MovementSystem } from '../systems/movementSystem'
import { AnimationSystem } from '../systems/animationSystem'
import { ExploringSystem } from '../systems/exploringSystem'
import { PlayerControllerSystem } from '../systems/playerControllerSystem'
import { GlobalEvents } from '../utils/globalEvents'

/**
 * Managed scene
 */
export class LevelOne extends Scene {
  protected bus: GlobalEvents = GlobalEvents.getInstance()

  public onInitialize() {
    WorldManager.getInstance(this)
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
  }

  public onActivate() {}

  public onDeactivate() {}
}
