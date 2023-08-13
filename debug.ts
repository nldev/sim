// debug
export class Debug {
  private static current_delay = 1000

  public static FakeDelay (delay: number = 250) {
    this.current_delay += delay
    return this.current_delay
  }
}
