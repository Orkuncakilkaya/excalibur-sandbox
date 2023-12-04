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
    maxStackCount: 5,
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
    maxStackCount: 5,
    maxDurability: 1,
    weight: 1,
    isStackable: true,
    isEquipment: false,
    durability: 1,
    stack: 1,
    hasDurability: false,
    isConsumable: false,
  }),
  stoneAxe: new ItemComponent({
    name: 'stoneAxe',
    label: 'Stone Axe',
    weight: 1,
    durability: 100,
    stack: 1,
    hasDurability: true,
    isEquipment: true,
    isConsumable: false,
    isStackable: false,
    maxDurability: 100,
    maxStackCount: 1,
  }),
  stonePickaxe: new ItemComponent({
    name: 'stonePickaxe',
    label: 'Stone Pickaxe',
    weight: 1,
    durability: 100,
    stack: 1,
    hasDurability: true,
    isEquipment: true,
    isConsumable: false,
    isStackable: false,
    maxDurability: 100,
    maxStackCount: 1,
  }),
}

const Recipes: { [key: string]: { name: string; stack: number }[] } = {
  stoneAxe: [
    { name: 'wood', stack: 2 },
    { name: 'stone', stack: 2 },
  ],
  stonePickaxe: [
    { name: 'wood', stack: 2 },
    { name: 'stone', stack: 3 },
  ],
}

export { Resources, Items, Recipes }
