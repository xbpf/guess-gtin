'use strict'

exports.validate = function (_digits) {
  // Clone tha array for our use.
  var digits = _digits.slice(0)

  var numberSystem = digits.shift()
  // Pop the check digit. We won't be using it.
  digits.pop()

  // UPC-E needs to use the 0 or 1 number system.
  if (numberSystem !== '0' && numberSystem !== '1') return false
  // We can expand this number.
  return true
}

exports.expand = function (digits) {
  var numberSystem = digits.shift()
  var checkDigit = digits.pop()
  var lastDigit = +digits.pop()
  var expanded

  switch (lastDigit) {
    case 0:
    case 1:
    case 2:
      expanded = digits.slice(0, 2).join('') + lastDigit + '0000' + digits.slice(2, 5).join('')
      break
    case 3:
    case 4:
      expanded = digits.slice(0, lastDigit).join('') + '00000' + digits.slice(lastDigit, 5).join('')
      break
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      expanded = digits.join('') + '0000' + lastDigit
      break
  }

  return numberSystem + expanded + checkDigit
}
