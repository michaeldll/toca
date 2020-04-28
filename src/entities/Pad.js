class Pad {
  constructor() {
    this.gamepad = null
    window.addEventListener('gamepadconnected', ev => {
      console.log(
        'Gamepad connected at index %d: %s. %d buttons, %d axes.',
        ev.gamepad.index,
        ev.gamepad.id,
        ev.gamepad.buttons.length,
        ev.gamepad.axes.length,
      )
      this.gamepad = ev.gamepad
    })
    window.addEventListener('gamepaddisconnected', ev => {
      this.gamepad = null
    })
  }
  hasGamepad() {
    return !!this.gamepad
  }
  getAxesX() {
    return this.hasGamepad() && navigator.getGamepads()[0].axes[0]
  }
  getAxesY() {
    return this.hasGamepad() && navigator.getGamepads()[0].axes[1]
  }
}

export default Pad
