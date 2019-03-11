const ui = {
  button: document.querySelector('[data-component="button"]')
}

function main(button) {
  if (!document.body.contains(button)) return

  button.addEventListener('click', onButtonCLick)
}

function onButtonCLick() {
  alert('You clicked. Good job!')
}

export default main(ui.button)
