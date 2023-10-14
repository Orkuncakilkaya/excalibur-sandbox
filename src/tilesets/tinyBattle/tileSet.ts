import { TileSet } from '../../types/tile/tile'
import { WaterTile } from './tiles'
import { SpriteSheet } from 'excalibur'
import { Resources } from '../../resources'
import { Constants } from '../../constants'

export const TinyBattleTileSet: TileSet = {
  name: 'tinyBattle',
  tiles: [WaterTile],
  sheet: SpriteSheet.fromImageSource({
    image: Resources.tinyBattle,
    grid: {
      spriteWidth: Constants.TileSize,
      spriteHeight: Constants.TileSize,
      rows: 11,
      columns: 19,
    },
  }),
}
