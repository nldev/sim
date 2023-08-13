import { FPS } from './constants'
import { Event, OPCODES } from './event'
import { Unit, UnitOptions } from './unit'
import { GetTime } from './utils'

export class Game {
  private last_update: number = GetTime()
  private events: Event[] = []
  private unit: { [key: string]: Unit } = {}

  constructor () {
    setInterval(() => this.loop(), FPS)
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
    if (event.opcode === OPCODES.UNIT_CREATE) {
      if (!Unit.Validate(payload))
        console.error('CREATE_UNIT event payload must be an object')
      this.AddUnit(Unit.Create(payload as UnitOptions))
    } else if (event.opcode === OPCODES.UNIT_START_ATTACKING) {
      if (typeof payload !== 'object')
        return
      if (!Unit.Validate(payload.unit))
        throw Error(`unit ${payload.unit} does not exist`)
      if (!Unit.Validate(payload.target))
        throw Error(`target ${payload.target} does not exist`)
      this.GetUnit(payload.unit).StartAttacking(payload.target)
    } else if (event.opcode === OPCODES.UNIT_STOP_ATTACKING) {
    } else if (event.opcode === OPCODES.DEBUG_LOG) {
      console.log(payload)
    }
  }

  public AddUnit (unit: Unit) {
    this.unit[unit.guid] = unit
  }

  public GetUnit (guid: number) {
    if (!this.unit[guid])
      throw Error('unit does not exist')
    return this.unit[guid]
  }

  public DoesUnitExist (guid: number) {
    return !!this.unit[guid]
  }

  public Push (event: Event | Event[]) {
    if (Array.isArray(event)) {
      for (const e of event)
        this.events.push(e)
      return
    }
    this.events.push(event)
  }
}
