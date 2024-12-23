const help = {}

help.randomNumber = () => {
  const character = "abcdefghijklmnopqrstuvwxyz0123456789"
  let randomNumber = 0
  for (let i = 0; i < 6; i++) {
    randomNumber += character.charAt(Math.floor(Math.random() * character.length))
  }

  return randomNumber
}

module.exports = help
