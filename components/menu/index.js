import $ from 'jquery'

class Menu {
  constructor (element, options) {
    this.element = $(element)
    this.closeButton = $(options.closeButton)
    this.body = $(options.body)
  }

  init () {
    if (!this.element.length) {
      return
    }
    this.onClickCloseButton()
  }

  onClickCloseButton () {
    this.closeButton.on('click', () => {
      this.element.removeClass('isActive')
      this.body.css({ overflow: '' })
    })
  }
}

const menu = new Menu('.menu', {
  closeButton: '.menu__closeButton',
  body: 'body'
})

menu.init()
