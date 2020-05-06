function findStr (array, target) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][0] === target) {
      return i
    }
  }
  return -1
}

function compareSecondColumn (a, b) {
  if (a[1] === b[1]) {
    return 0
  } else {
    return (a[1] > b[1]) ? -1 : 1
  }
}

function roundPrecision (value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

function predictTurnips (daisyPrice, nookPrices, previousPattern) { // eslint-disable-line no-unused-vars
  // The prices array is formatted like:
  // [price, price, M-AM, M-PM, T-AM, T-PM, W-AM, W-PM, Th-AM, Th-PM, F-AM, F-PM, S-AM, S-PM, Su-AM, Su-PM]
  var turnipPrices = [daisyPrice, daisyPrice, ...nookPrices]

  // Parse previous pattern
  var previousPatternInt
  switch (previousPattern) {
    case 'Fluctuating':
      previousPatternInt = 0
      break
    case 'Large spike':
      previousPatternInt = 1
      break
    case 'Decreasing':
      previousPatternInt = 2
      break
    case 'Small spike':
      previousPatternInt = 3
      break
    default:
      previousPatternInt = -1
  }

  // Parse the incoming price array for integers
  for (let i = 0; i < turnipPrices.length; i++) {
    turnipPrices[i] = parseInt(turnipPrices[i])
  }

  // Obtain all possible patterns and probabilities. Obtain the min max values from the 'All patterns' pattern.
  var pricePrediction = []
  var possiblePatterns = []
  for (const poss of analyze_possibilities(turnipPrices, false, previousPatternInt)) { // eslint-disable-line no-undef
    // Collect possible patterns and aggregate the probabilities.
    if (poss.pattern_description !== 'All patterns') {
      var patternIndex = findStr(possiblePatterns, poss.pattern_description)
      if (patternIndex === -1) {
        possiblePatterns.push([poss.pattern_description, poss.probability])
      } else {
        possiblePatterns[patternIndex][1] += poss.probability
      }

    // Obtain min max values from the 'All patterns' pattern.
    } else {
      for (const day of poss.prices.slice(2)) {
        if (day.min > day.max) {
          pricePrediction.push('')
        } else if (day.min !== day.max) {
          pricePrediction.push(day.min + ' to ' + day.max)
        } else {
          pricePrediction.push(day.min + '')
        }
      }
    }
  }

  // Generate the 'Possible patterns' strings
  pricePrediction.push('Possible patterns')

  // Parse the possiblePatterns array.
  var possiblePatternsString = ''
  if (possiblePatterns.length === 0) {
    possiblePatternsString += 'Unknown'
  } else {
    // The second column contains the propability values. The compare function makes it so they are descending in the resulting array.
    possiblePatterns.sort(compareSecondColumn)
    for (const patt of possiblePatterns) {
      // Delimiter if not the first entry.
      if (possiblePatternsString.length !== 0) {
        possiblePatternsString += ' | '
      }
      // Omit probabilities if they are not available
      if (isNaN(patt[1])) {
        possiblePatternsString += patt[0]
      } else {
        // Convert probabilities to percentages rounded to one decimal place
        possiblePatternsString += patt[0] + ' (' + roundPrecision(patt[1] * 100, 1) + '%)'
      }
    }
  }
  pricePrediction.push(possiblePatternsString)

  return pricePrediction
}
