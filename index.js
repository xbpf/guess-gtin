'use strict'

module.exports = function (code, upce) {
  var retval = {
    format: null,
    real: null,
    valid: false,
    expanded: null
  }

  // Input must be a number or a string.
  if (typeof code === 'number') code = String(code)
  if (typeof code !== 'string') return retval

  // String must have all digits.
  if (!/^\d+$/.test(code)) return retval

  // Stting must have lengtsh of either 8, 12, 13, or 14.
  var digits = code.split('')
  switch (digits.length) {
    case 8:
      if (upce) {
        retval.format = 'UPC-E'
        retval.real = 'UPC-E'
      } else {
        retval.format = 'GTIN-8'
        retval.real = 'GTIN-8'
      }
      break
    case 12:
      retval.format = 'GTIN-12'
      break
    case 13:
      retval.format = 'GTIN-13'
      break
    case 14:
      retval.format = 'GTIN-14'
      break
    default:
      return retval
  }

  if (retval.format === 'UPC-E') {
    return processUPCE(digits, retval)
  }

  if (retval.format !== 'GTIN-8') {
    retval.real = determineReal(digits, retval.format)
  }

  padDigits(digits)
  retval.valid = validateChecksum(digits)

  return retval
}

function processUPCE (digits, retval) {
  var canExpand = validateUPCE(digits)
  if (!canExpand) return retval
  retval.expanded = expandUPCE(digits)
  padDigits(digits)
  retval.valid = validateChecksum(digits)
  return retval
}

function validateUPCE (digits) {
  const numberSystem = digits[0]
  // UPC-E needs to use the 0 or 1 number system.
  if (numberSystem !== '0' && numberSystem !== '1') return false
}

function determineReal (digits, format) {
  var code = digits.join('')
  if (/^0{1,6}\d{8}$/.test(code)) return 'GTIN-8'
  if (/^0{1,2}\d{12}$/.test(code)) return 'GTIN-12'
  if (/^0{1}\d{13}$/.test(code)) return 'GTIN-13'
  return format
}

function padDigits (digits) {
  var zeroes = 14 - digits.length
  for (let i = 0; i < zeroes; i++) {
    digits.unshift('0')
  }
}

function validateChecksum (digits) {
  var check = digits.pop()
  var newNumbers = digits.map(function (num, idx) {
    return num * ((idx % 2 === 0) ? 3 : 1)
  })
  var sum = newNumbers.reduce(function (prev, cur) {
    return prev + cur
  })
  return (check === String((10 - (sum % 10)) % 10))
}
