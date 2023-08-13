import { Thunkify } from './types'
import { UnitOptions } from './unit'
import { GetTime } from './utils'

export function Event (opcode: OpcodeID, payload: any, delay: number = 0) {
  switch (opcode) {
    case OPCODES.UNIT_CREATE:
      return new UnitCreateEvent(payload, delay)
    case OPCODES.UNIT_SET_TARGET:
      return new UnitSetTargetEvent(payload, delay)
    case OPCODES.UNIT_CLEAR_TARGET:
      return new UnitClearTargetEvent(payload, delay)
    case OPCODES.UNIT_START_ATTACKING:
      return new UnitStartAttackingEvent(payload, delay)
    case OPCODES.UNIT_STOP_ATTACKING:
      return new UnitStopAttackingEvent(payload, delay)
    case OPCODES.DEBUG_LOG:
      return new DebugLogEvent(payload, delay)
    case OPCODES.DEBUG_SCRIPT:
      return new DebugScriptEvent(payload, delay)
    default:
      return new BaseEvent(payload, delay)
  }
}

export type Opcode = keyof typeof OPCODES
export type OpcodeID = (typeof OPCODES)[Opcode]

export const OPCODES = {
  NOOP: 0,
  // unit
  UNIT_SET_TARGET: 1,
  UNIT_CLEAR_TARGET: 2,
  UNIT_CREATE: 3,
  UNIT_START_ATTACKING: 4,
  UNIT_STOP_ATTACKING: 5,
  // debug
  DEBUG_LOG: 6,
  DEBUG_SCRIPT: 7,
} as const

export class BaseEvent {
  public opcode: OpcodeID = OPCODES.NOOP
  public delay: number = GetTime()

  constructor (public payload: any, delay: number = 0) {
    if (delay > 0)
      this.delay += delay
  }
}

export class UnitCreateEvent extends BaseEvent {
  opcode = OPCODES.UNIT_CREATE
  payload: Thunkify<UnitOptions>

  constructor (payload: any, delay: number = 0) {
    super(payload, delay)
    this.payload = payload
  }
}

export class UnitSetTargetEvent extends BaseEvent {
  opcode = OPCODES.UNIT_SET_TARGET
  payload: Thunkify<{
    unit: number
    target: number
  }>

  constructor (payload: any, delay: number = 0) {
    super(payload, delay)
    this.payload = payload
  }
}

export class UnitClearTargetEvent extends BaseEvent {
  opcode = OPCODES.UNIT_CLEAR_TARGET

  constructor (payload = undefined, delay: number = 0) {
    super(payload, delay)
    this.payload = payload
  }
}

export class UnitStartAttackingEvent extends BaseEvent {
  opcode = OPCODES.UNIT_START_ATTACKING
  payload: Thunkify<{
    unit: number
    target: number
  }>

  constructor (payload: any, delay: number = 0) {
    super(payload, delay)
    this.payload = payload
  }
}

export class UnitStopAttackingEvent extends BaseEvent {
  opcode = OPCODES.UNIT_STOP_ATTACKING

  constructor (payload = undefined, delay: number = 0) {
    super(payload, delay)
    this.payload = payload
  }
}

export class DebugLogEvent extends BaseEvent {
  opcode = OPCODES.DEBUG_LOG
  payload: Thunkify<any>

  constructor (payload: any, delay: number = 0) {
    super(payload, delay)
    this.payload = payload
  }
}

export class DebugScriptEvent extends BaseEvent {
  opcode = OPCODES.DEBUG_SCRIPT
  payload: () => void

  constructor (payload: any, delay: number = 0) {
    super(payload, delay)
    this.payload = payload
  }
}

export type Event =
  | BaseEvent
  | UnitCreateEvent
  | UnitSetTargetEvent
  | UnitClearTargetEvent
  | UnitStartAttackingEvent
  | UnitStopAttackingEvent
  | DebugLogEvent
  | DebugScriptEvent
