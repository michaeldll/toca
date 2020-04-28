export default class Mouse {
  constructor() {
    window.addEventListener('mousemove', ev => {
      this.x = ev.x
      this.y = ev.y
    })
  }
  getPosition() {
    return { x: this.x, y: this.y }
  }
}
