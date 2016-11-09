const ui = {
  Header: document.querySelector('header')
}

function sayHello (greeting) {
  ui.Header.innerHTML += greeting
}

module.exports = sayHello
