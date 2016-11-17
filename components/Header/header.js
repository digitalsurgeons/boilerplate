export default class Header {
  constructor(element, options) {
    if (!element) {
      return
    }
    this.element = element
    this.message = options.message
    this.sayHello(this.message)
  }

  sayHello (greeting = 'sup?') {
    this.element.innerHTML += greeting
  }
}

const header = document.querySelector('.Header')

new Header(header, {
  message: 'hello!'
})
