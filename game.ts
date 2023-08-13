import { FPS, LOOP } from './constants'
import { Event, OPCODES } from './event'
import { Unit, UnitOptions } from './unit'
import { GetTime } from './utils'

class Handlers {
  public static UnitCreate (payload: UnitOptions) {
    if (typeof payload !== 'object')
      return console.error ('payload is not an object')
    if (!Unit.Validate(payload))
      return console.error('payload is not valid')
    Unit.Create(payload)
  }

  public static UnitStartAttacking (payload: { unit: number, target: number }) {
    if (typeof payload !== 'object')
      return console.error ('payload is not an object')
    if (Unit.Exists(payload.unit)) {
      game.GetUnit(payload.unit).StartAttacking(payload.target)
    } else {
      console.error(`target ${payload.target} does not exist`)
    }
  }

  public static UnitStopAttacking (payload: number) {
    if (typeof payload !== 'number')
      return console.error('payload is not a valid GUID')
    if (Unit.Exists(payload)) {
      game.GetUnit(payload).StopAttacking()
    } else {
      console.error(`target ${payload} does not exist`)
    }
  }

  public static DebugLog (payload: any) {
    console.log(payload)
  }
}

export class Game {
  private last_update: number = GetTime()
  private events: Event[] = []
  private units: { [key: string]: Unit } = {}

  constructor () {
    setInterval(() => this.loop(), LOOP)
  }

  private loop () {
    const time = GetTime()
    const delta = time - this.last_update
    if (delta >= FPS) {
      this.last_update = time
      this.update()
    }
  }

  private update () {
    for (const event of this.events) {
      if (this.last_update < (event.delay || 0))
        continue
      this.handle(event)
      this.events.shift()
    }
  }

  private handle (event: Event) {
    const payload = (typeof event.payload === 'function') ? event.payload() : event.payload
    switch (event.opcode) {
      case OPCODES.UNIT_CREATE:
        Handlers.UnitCreate(payload)
        break
      case OPCODES.UNIT_START_ATTACKING:
        Handlers.UnitStartAttacking(payload)
        break
      case OPCODES.UNIT_STOP_ATTACKING:
        Handlers.UnitStopAttacking(payload)
        break
      case OPCODES.DEBUG_LOG:
        Handlers.DebugLog(payload)
        break
    }
  }

  public Push (event: Event | Event[]) {
    if (Array.isArray(event)) {
      for (const e of event)
        this.events.push(e)
      return
    }
    this.events.push(event)
  }

  public AddUnit (unit: Unit) {
    this.units[unit.guid] = unit
  }

  public GetUnit (guid: number) {
    if (!this.units[guid])
      throw Error('unit does not exist')
    return this.units[guid]
  }

  public DoesUnitExist (guid: number) {
    return !!this.units[guid]
  }
}

export const game = new Game()
