import { ImageSource } from 'excalibur'
import tinyBattleTileSet from './images/tilesets/tinyBattle.png'
import tinyTownTileSet from './images/tilesets/tinyTown.png'
import spriteCharacterPrototype from './images/character/prototype.png'

const Resources = {
  tinyBattle: new ImageSource(tinyBattleTileSet),
  tinyTown: new ImageSource(tinyTownTileSet),
  prototype: new ImageSource(spriteCharacterPrototype),
}

export { Resources }
