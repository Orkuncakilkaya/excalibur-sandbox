import { ImageSource } from 'excalibur'
import tinyBattleTileSet from './images/tilesets/tinyBattle.png'
import tinyTownTileSet from './images/tilesets/tinyTown.png'
import spriteCharacterPrototype from './images/character/prototype.png'
import inventoryIcons from './images/inventory/items.png'
import { ItemComponent } from './components/itemComponent'

/*export const ItemSpriteSheet = SpriteSheet.fromImageSource({
  image: new ImageSource(inventoryIcons),
  grid: {
    rows: 1,
    columns: 1,
    spriteWidth: 32,
    spriteHeight: 32,
  },
})*/

const Resources = {
  tinyBattle: new ImageSource(tinyBattleTileSet),
  tinyTown: new ImageSource(tinyTownTileSet),
  prototype: new ImageSource(spriteCharacterPrototype),
  itemsIcons: new ImageSource(inventoryIcons),
}

const Items = {
  stone: new ItemComponent({
    name: 'stone',
    label: 'Stone',
    maxStackCount: 2,
    maxDurability: 1,
    weight: 1,
    isStackable: true,
    isEquipment: false,
    isConsumable: false,
    stack: 1,
    hasDurability: false,
    durability: 1,
  }),
  wood: new ItemComponent({
    name: 'wood',
    label: 'Wood',
    maxStackCount: 2,
    maxDurability: 1,
    weight: 1,
    isStackable: true,
    isEquipment: false,
    durability: 1,
    stack: 1,
    hasDurability: false,
    isConsumable: false,
  }),
}

export { Resources, Items }
