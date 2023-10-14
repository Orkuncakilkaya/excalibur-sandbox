import { TileSet } from '../../types/tile/tile'
import { HillTile, PlainTile, SandTile } from './tiles'
import { SpriteSheet } from 'excalibur'
import { Resources } from '../../resources'
import { Constants } from '../../constants'

export const TinyTownTileSet: TileSet = {
  name: 'tinyTown',
  tiles: [SandTile, PlainTile, HillTile],
  sheet: SpriteSheet.fromImageSource({
    image: Resources.tinyTown,
    grid: {
      spriteWidth: Constants.TileSize,
      spriteHeight: Constants.TileSize,
      rows: 12,
      columns: 11,
    },
  }),
}
