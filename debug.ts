// debug
export class Debug {
  private static current_delay = 1000

  public static GetDelay (delay: number = 100) {
    this.current_delay += delay
    return this.current_delay
  }
}
