function find_str(array, target){
  for(var i = 0; i < array.length; i++){
    if(array[i][0] == target){
      return i;
    }
  }
  return -1;
}

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

function round_p(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function predict_turnips(daisy_price, nook_prices, previous_pattern) {
  // The prices array is formatted like:
  // [price, M-AM, M-PM, T-AM, T-PM, W-AM, W-PM, Th-AM, Th-PM, F-AM, F-PM, S-AM, S-PM, Su-AM, Su-PM]
  var turnip_prices = [daisy_price, daisy_price, ...nook_prices];
  
  // Parse previous pattern
  var previous_pattern_int;
  switch (previous_pattern) {
    case "Fluctuating":
      previous_pattern_int = 0;
      break;
    case "Large spike":
      previous_pattern_int = 1;
      break;
    case "Decreasing":
      previous_pattern_int = 2;
      break;
    case "Small spike":
      previous_pattern_int = 3;
      break;
    default:
      previous_pattern_int = -1;
  }
  
  // Generate hyperlink
  //var hyperlink_prices = [daisy_price, ...nook_prices].join(".");
  //var possible_patterns_hyperlink = "https://turnipprophet.io/index.html?first-time=false&pattern=" + previous_pattern_int + "&prices=" + hyperlink_prices + "&action=";
  
  // Parse the incoming price array for integers
  for (let i = 0; i < turnip_prices.length; i++) {
    turnip_prices[i] = parseInt(turnip_prices[i]);
  }
  
  // Obtain all possible patterns and probabilities. Obtain the min max values from the 'All patterns' pattern.
  var price_prediction = [];
  var possible_patterns = [];
  for (let poss of analyze_possibilities(turnip_prices, false, previous_pattern_int)) {
    
    // Collect possible patterns and aggregate the probabilities.
    if (poss.pattern_description !== "All patterns") {
      var pattern_index = find_str(possible_patterns, poss.pattern_description);
      if (pattern_index == -1) {
        possible_patterns.push([poss.pattern_description, poss.probability]);
      } else {
        possible_patterns[pattern_index][1] += poss.probability;
      }
      
    // Obtain min max values from the 'All patterns' pattern.
    } else {
      for (let day of poss.prices.slice(2)) {
        if (day.min > day.max) {
          price_prediction.push("");
        } else if (day.min !== day.max) {
          price_prediction.push(day.min + " to " + day.max);
        } else {
          price_prediction.push(day.min + "");
        }
      }
    }
  }
  
  // Generate the 'Possible patterns' strings
  //price_prediction.push('HYPERLINK( "' + possible_patterns_hyperlink + '", "Possible patterns" )');
  price_prediction.push("Possible patterns");
  
  // Parse the possible_patterns array.
  var possible_patterns_string = "";
  if (possible_patterns.length == 0) {
    possible_patterns_string += "Unknown";
  } else {
    // The second column contains the propability values. The compare function makes it so they are descending in the resulting array.
    possible_patterns.sort(compareSecondColumn);
    for (let patt of possible_patterns) {
      // Delimiter if not the first entry.
      if (possible_patterns_string.length !== 0) {
        possible_patterns_string += " | ";
      }
      // Omit probabilities if they are not available
      if (isNaN(patt[1])) {
        possible_patterns_string += patt[0];
      } else {
        possible_patterns_string += patt[0] + " (" + round_p(patt[1]*100, 1) + "%)";
      }
    }
  }
  price_prediction.push(possible_patterns_string);
  
  return price_prediction;
}