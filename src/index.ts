import { Engine, DisplayMode } from 'excalibur'
import { LevelOne } from './scenes/levelOne'
import { Resources } from './resources'
import { Loader } from './loader'
import App from './ui/App.svelte'

/**
 * Managed game class
 */
class Game extends Engine {
  private levelOne!: LevelOne

  constructor() {
    super({
      displayMode: DisplayMode.FillScreen,
      viewport: { width: 1920, height: 1080 },
      resolution: { width: 3000, height: 3000 },
      suppressHiDPIScaling: true,
      suppressPlayButton: true,
      suppressConsoleBootMessage: true,
    })
  }

  public start() {
    this.levelOne = new LevelOne()
    game.add('levelOne', this.levelOne)

    // Automatically load all default resources
    const loader = new Loader(Object.values(Resources))

    return super.start(loader)
  }
}

const game = new Game()
game.start().then(() => {
  game.goToScene('levelOne')
})

new App({ target: document.getElementById('ui') })
