import { Scene, Timer } from 'excalibur'
import { WorldManager } from '../world/worldManager'
import { Player } from '../actors/player'
import { Cursor } from '../actors/cursor'
import { MovementSystem } from '../systems/movementSystem'
import { AnimationSystem } from '../systems/animationSystem'
import { ExploringSystem } from '../systems/exploringSystem'
import { PlayerControllerSystem } from '../systems/playerControllerSystem'
import { VisibleBehindObjectsSystem } from '../systems/visibleBehindObjectsSystem'
import { GameScreen, onUIStateChanged, dispatchUIState } from '../ui/events/uiState'
import { Serializer } from '../utils/serializer'

/**
 * Managed scene
 */
export class LevelOne extends Scene {
  public onInitialize() {
    Serializer.getInstance()
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
    dispatchUIState({ screen: GameScreen.HUD })
    onUIStateChanged((event) => {
      if (event.detail.screen === GameScreen.Pause) {
        this.engine.stop()
      } else if (event.detail.screen === GameScreen.HUD) {
        this.engine.start()
      }
    })
    const saveTimer = new Timer({
      interval: 2000,
      fcn: () => {
        Serializer.getInstance().save()
      },
      repeats: true,
    })
    this.add(saveTimer)
    saveTimer.start()
  }

  public onActivate() {}

  public onDeactivate() {
    Serializer.getInstance().save()
  }
}
