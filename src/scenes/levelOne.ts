import { Scene } from 'excalibur'
import { WorldManager } from '../world/worldManager'
import { Player } from '../actors/player'
import { Cursor } from '../actors/cursor'
import { MovementSystem } from '../systems/movementSystem'
import { AnimationSystem } from '../systems/animationSystem'
import { ExploringSystem } from '../systems/exploringSystem'
import { PlayerControllerSystem } from '../systems/playerControllerSystem'
import { VisibleBehindObjectsSystem } from '../systems/visibleBehindObjectsSystem'
import { GameScreen, uiStateChanged } from '../ui/events/uistate'

/**
 * Managed scene
 */
export class LevelOne extends Scene {
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
    this.world.add(new VisibleBehindObjectsSystem())
    uiStateChanged({ screen: GameScreen.HUD })
  }

  public onActivate() {}

  public onDeactivate() {}
}
