import $ from 'jquery'
import Headroom from 'headroom.js'

class Header {
  constructor (element, options) {
    this.element = $(element)
    this.hamburger = $(options.hamburger)
    this.menu = $(options.menu)
    this.body = $(options.body)
  }

  init () {
    if (!this.element.length) {
      return
    }
    this.initHeadroom()
    this.onClickHamburger()
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

  onClickHamburger () {
    this.hamburger.on('click', () => {
      this.menu.addClass('isActive')
      this.body.css('overflow', 'hidden')
    })
  }
}

const header = new Header('.header', {
  hamburger: '.header__hamburger',
  menu: '.menu',
  body: 'body'
})

header.init()
