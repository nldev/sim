import './game'
// TODO: replace test code with client
import { Debug } from './debug'
import { Event, OPCODES } from './event'
import { game } from './game'

game.Push([
  Event(OPCODES.UNIT_CREATE, { name: 'player' }, Debug.FakeDelay()),
  Event(OPCODES.UNIT_CREATE, { name: 'boar' }, Debug.FakeDelay()),
  Event(OPCODES.UNIT_START_ATTACKING, { unit: 0, target: 1 }, Debug.FakeDelay()),
  Event(OPCODES.DEBUG_LOG, () => game.GetUnit(0).IsAttacking(), Debug.FakeDelay()),
  Event(OPCODES.UNIT_STOP_ATTACKING, 0, Debug.FakeDelay()),
  Event(OPCODES.DEBUG_LOG, () => game.GetUnit(0).IsAttacking(), Debug.FakeDelay()),
])
