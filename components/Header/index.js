import $ from 'jquery'

class Header {
  constructor (element, options) {
    this.element = $(element)
    this.message = options.message
  }

  init () {
    if (!this.element.length) {
      return
    }
    this.sayHello(this.message)
  }

  sayHello (greeting = 'sup?') {
    $(this.element).html(greeting)
  }
}

const header = new Header('.header', {
  message: 'hello!'
})

header.init()
