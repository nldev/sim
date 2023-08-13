// util
export function GetTime () {
  return Date.now() || 0
}

export class Bitmask {
  static IsEnabled (mask: number, position: number) {
    return (mask & (1 << position)) > 0
  }

  static Set (mask: number, position: number, isEnabled: boolean) {
    if (position > 30)
      throw 'bitmask position cannot be greater than 30'
    if (isEnabled)
      return mask | (1 << position)
    else
      return mask & ~(1 << position)
  }

  static Flip (mask: number, position: number) {
    if (!Bitmask.IsEnabled(mask, position))
      return Bitmask.Set(mask, position, true)
    else
      return Bitmask.Set(mask, position, false)
  }

  static JSON (mask: number) {
    return '0b' + mask.toString(2).padStart(8, '0')
  }
}
