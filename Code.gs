function findStr (array, target) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][0] === target) {
      return i
    }
  }
  return -1
}

function roundPrecision (value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

function analyzePossibilities (inTurnipPrices, inPreviousPatternInt) {
  const predictor = new Predictor(inTurnipPrices, false, inPreviousPatternInt) // eslint-disable-line no-undef
  return predictor.analyze_possibilities()
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

  // NaN-pad length if needed
  for (let i = turnipPrices.length; i < 14; i++) {
    turnipPrices.push(NaN)
  }

  // Obtain all possible patterns and probabilities. Obtain the min max values from the 'All patterns' pattern.
  var pricePrediction = []
  var possiblePatterns = []
  var patternDescriptions = { 0: 'Fluctuating', 1: 'Large spike', 2: 'Decreasing', 3: 'Small spike', 4: 'All patterns' }
  for (const poss of analyzePossibilities(turnipPrices, previousPatternInt)) { // eslint-disable-line no-undef
    const patternDescription = patternDescriptions[poss.pattern_number]
    // Obtain min max values from the 'All patterns' pattern.
    if (patternDescription === 'All patterns') {
      for (const day of poss.prices.slice(2)) {
        if (day.min > day.max) {
          pricePrediction.push('')
        } else if (day.min !== day.max) {
          pricePrediction.push(day.min + ' to ' + day.max)
        } else {
          pricePrediction.push(day.min + '')
        }
      }
    // Collect possible patterns and aggregate the probabilities.
    } else {
      if (findStr(possiblePatterns, patternDescription) === -1) {
        possiblePatterns.push([patternDescription, poss.category_total_probability])
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
  possiblePatternsString = possiblePatternsString.replace('(100%) ', '(≥ 99.5%) ')
  possiblePatternsString = possiblePatternsString.replace('(0%)', '(< 0.05%)')
  pricePrediction.push(possiblePatternsString)

  return pricePrediction
}

function testAnalyzePossibilities () { // eslint-disable-line no-unused-vars
  const predictor = new Predictor([103, 103, 91, 138, 161, 504, , 143, , , , , , ], false, 0) // eslint-disable-line no-undef, no-sparse-arrays, array-bracket-spacing
  const prediction = predictor.analyze_possibilities()
  return prediction
}

function testPredictTurnips (daisyPrice, nookPrices, previousPattern) { // eslint-disable-line no-unused-vars
  const prediction = predictTurnips(103, [91, 138, 161], 'Fluctuating')
  return prediction
}
