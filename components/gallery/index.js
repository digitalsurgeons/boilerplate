import $ from 'jquery'

class Gallery {
  constructor (element, options) {
    this.element = $(element)
    this.carousel = $(options.carousel)
    this.nextButton = $(options.nextButton)
    this.previousButton = $(options.previousButton)
    this.currentPage = $(options.currentPage)
    this.slideCount = null
  }

  init () {
    if (!this.element.length) {
      return
    }
    this.initCarousel()
    this.onSlideChange()
  }

  initCarousel () {
    $(this.carousel).slick({
      // normal options...
      infinite: false,
      swipeToSlide: true,
      prevArrow: this.previousButton,
      nextArrow: this.nextButton
    })
    this.slideCount = this.carousel.slick('getSlick').slideCount
  }

  onSlideChange () {
    this.carousel.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
      this.currentPage.text(nextSlide + 1)
      // if we're on the first slide disable the previous button
      console.log(currentSlide)
      if (!nextSlide) {
        this.previousButton.addClass('gallery__arrow--disabled')
      } else {
        this.previousButton.removeClass('gallery__arrow--disabled')
      }
      // if we're on the last slide disable the next button
      if (nextSlide + 1 === this.slideCount) {
        this.nextButton.addClass('gallery__arrow--disabled')
      } else {
        this.nextButton.removeClass('gallery__arrow--disabled')
      }
    })
  }
}

const gallery = new Gallery('.gallery', {
  carousel: '.gallery__list',
  nextButton: '.gallery__arrow--right',
  previousButton: '.gallery__arrow--left',
  currentPage: '.gallery__currentPage'
})

gallery.init()

