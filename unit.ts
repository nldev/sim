import { game } from './game'

export const PowerTypes = {
  NONE: 0,
  MANA: 1,
  RAGE: 2,
  ENERGY: 3,
}
export type PowerType = keyof typeof PowerTypes
export type PowerTypeID = (typeof PowerTypes)[PowerType]
export const Schools = {
  NONE: 0,
  HOLY: 1,
  FIRE: 2,
  NATURE: 3,
  FROST: 4,
  SHADOW: 5,
  ARCANE: 6,
}

export interface UnitOptions {
  name: string
  guid?: number
  powerType?: PowerType
  health?: number
  maxHealth?: number
  power?: number
  maxPower?: number
  attackMin?: number
  attackMax?: number
  attackSpeed?: number
}

export class Unit {
  public static new_guid_index = 0

  public guid: number
  public name: string
  private health: number = 1
  private maxHealth: number = 1
  private power: number = 0
  private maxPower: number = 0
  private powerType: PowerTypeID = PowerTypes.NONE
  private attackMin: number = 0
  private attackMax: number = 0
  private attackSpeed: number = 0
  private target: number = -1
  private attacking: number = -1

  constructor (options: UnitOptions) {
    this.guid = options.guid || Unit.new_guid_index++
    this.name = options.name
    this.health = (typeof options.health === 'number') ? options.health : 1
    this.maxHealth = options.maxHealth || 1
    if (typeof options.powerType === 'string') {
      this.powerType = PowerTypes[options.powerType]
      this.power = (typeof options.power === 'number') ? options.power : 0
      this.maxPower = options.maxPower || 0
    }
    if (typeof options.attackMin === 'number')
      this.attackMin = options.attackMin
    if (typeof options.attackMax === 'number')
      this.attackMax = options.attackMax
    if (typeof options.attackSpeed === 'number')
      this.attackSpeed = options.attackSpeed
    game.AddUnit(this)
  }

  public GetGUID () {
    return this.guid
  }

  public GetTarget () {
    return this.target
  }

  public SetTarget (target: number) {
    if (!target || (target === -1))
      this.target = -1
    else if (Unit.Exists(target))
      this.target = target
    else
      console.error(`tried to set target to invalid unit guid (${target})`)
  }

  public StartAttacking (target: number) {
    if (!target || (target === -1))
      this.attacking = -1
    else if (Unit.Exists(target))
      this.attacking = target
    else
      console.error(`tried to set attacking to invalid unit guid (${target})`)
  }

  public StopAttacking () {
    this.attacking = -1
  }

  public IsAttacking () {
    return this.attacking
  }

  public SetHealth (health: number) {
    this.health = health
  }

  public static Exists (guid: number) {
    return game.DoesUnitExist(guid)
  }

  public static Validate (options: any) {
    if (typeof options !== 'object')
      return false
    else if (typeof options.name !== 'string')
      return false
    return true
  }

  public static Create (options: UnitOptions) {
    console.log(options)
    return new Unit(options)
  }
}
