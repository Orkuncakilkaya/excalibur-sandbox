import { EventEmitter } from 'excalibur'
import { DefaultEvents } from '../types/events'

export class GlobalEvents<TEvents extends DefaultEvents = DefaultEvents> {
  protected static _instance: GlobalEvents
  public readonly emitter: EventEmitter<TEvents> = new EventEmitter<TEvents>()

  private constructor() {}

  public static getInstance<Events extends DefaultEvents = DefaultEvents>(): GlobalEvents<Events> {
    if (!this._instance) {
      this._instance = new GlobalEvents()
    }

    return this._instance as GlobalEvents<Events>
  }
}
