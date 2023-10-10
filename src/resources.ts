import { ImageSource } from 'excalibur'
import sword from './images/sword.png'
import terrain from './images/tilemap_packed.png'
import bodyMale from './images/character/walkcycle/BODY_male.png'

/**
 * Default global resource dictionary. This gets loaded immediately
 * and holds available assets for the game.
 */
const Resources = {
  Sword: new ImageSource(sword),
  Terrain: new ImageSource(terrain),
  BodyMale: new ImageSource(bodyMale),
}

export { Resources }
