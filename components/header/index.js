import $ from 'jquery'
import Headroom from 'headroom.js'

class Header {
  constructor (element, options) {
    this.element = $(element)
    this.message = options.message
  }

  init () {
    if (!this.element.length) {
      return
    }
    this.initHeadroom()
  }

  initHeadroom () {
    const headroom = new Headroom(this.element[0], {
      classes: {
        // when element is initialised
        initial: 'header',
        // when scrolling up
        pinned: 'header--pinned',
        // when scrolling down
        unpinned: 'header--unpinned',
        // when above offset
        top: 'header--top',
        // when below offset
        notTop: 'header--notTop',
        // when at bottom of scoll area
        bottom: 'header--bottom',
        // when not at bottom of scroll area
        notBottom: 'header--notBottom'
      },
      tolerance: {
        down: 10,
        up: 20
      }
    })

    headroom.init()
  }
}

const header = new Header('.header', {
  hamburger: 'header__hamburger!'
})

header.init()
