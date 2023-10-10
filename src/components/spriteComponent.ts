import { Component, ImageSource, SpriteSheet } from 'excalibur'

export class SpriteComponent extends Component {
  readonly type = 'sprite'
  spriteSource: ImageSource
  spriteSize: number
  spriteRow: number
  spriteCol: number

  constructor({
    spriteSource,
    spriteSize,
    spriteRow,
    spriteCol,
  }: {
    spriteSource: ImageSource
    spriteSize: number
    spriteRow: number
    spriteCol: number
  }) {
    super()
    this.spriteSource = spriteSource
    this.spriteSize = spriteSize
    this.spriteRow = spriteRow
    this.spriteCol = spriteCol
  }

  get sheet(): SpriteSheet {
    return SpriteSheet.fromImageSource({
      image: this.spriteSource,
      grid: {
        spriteWidth: this.spriteSize,
        spriteHeight: this.spriteSize,
        rows: this.spriteRow, // 4
        columns: this.spriteCol, // 9
      },
    })
  }
}
