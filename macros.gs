/** @OnlyCurrentDoc */

function resetToNewWeek () { // eslint-disable-line no-unused-vars
  var spreadsheet = SpreadsheetApp.getActive() // eslint-disable-line no-undef

  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true)
  var numberOfRows = spreadsheet.getActiveSheet().getMaxRows()

  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Last Week'), true)
  spreadsheet.getRange('A3').activate()
  spreadsheet.getRange('Tracker!A3:P' + numberOfRows).copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false) // eslint-disable-line no-undef

  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true)
  var j
  var currentPattern
  var previousPattern
  for (let i = 3; i < numberOfRows; i = i + 2) {
    j = i + 1
    currentPattern = spreadsheet.getRange('P' + j).activate().getValue()
    switch (currentPattern) {
      case 'Fluctuating':
      case 'Fluctuating (100%)':
        previousPattern = 'Fluctuating'
        break
      case 'Large spike':
      case 'Large spike (100%)':
        previousPattern = 'Large spike'
        break
      case 'Decreasing':
      case 'Decreasing (100%)':
        previousPattern = 'Decreasing'
        break
      case 'Small spike':
      case 'Small spike (100%)':
        previousPattern = 'Small spike'
        break
      case '':
        previousPattern = ''
        break
      default:
        previousPattern = 'Unknown'
    }
    spreadsheet.getRange('P' + i).activate().setValue(previousPattern)
    spreadsheet.getRange('B' + i + ':N' + i).activate()
      .clear({ contentsOnly: true, skipFilteredRows: true })
  }
};

function Addednewrow () {
  var spreadsheet = SpreadsheetApp.getActive() // eslint-disable-line no-undef
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true)

  // Insert 2 new rows for 1 new contributor and determine max rows.
  spreadsheet.getActiveSheet().insertRowsAfter(spreadsheet.getActiveSheet().getMaxRows(), 2)
  var numberOfRows = spreadsheet.getActiveSheet().getMaxRows()
  var newRow = numberOfRows - 1

  // copy formatting (including data validation), formulas and conditional formatting from first row.
  spreadsheet.getRange('A3:P4').copyTo(spreadsheet.getRange('A' + newRow))
  spreadsheet.getRange('P' + newRow).activate()
    .clear({ contentsOnly: true, skipFilteredRows: true })
  spreadsheet.getRange('B' + newRow + ':N' + newRow).activate()
    .clear({ contentsOnly: true, skipFilteredRows: true })
  spreadsheet.getRange('A' + newRow + ':A' + numberOfRows).activate()
    .clear({ contentsOnly: true, skipFilteredRows: true })

  // set interactable cells to unprotected
  var allProtections = spreadsheet.getActiveSheet().getProtections(SpreadsheetApp.ProtectionType.SHEET) // eslint-disable-line no-undef
  var protection = allProtections[0]
  var unprotectedRanges = [spreadsheet.getRange('A3:A' + numberOfRows), spreadsheet.getRange('B3:N3'), spreadsheet.getRange('P3')]
  for (let i = 5; i < numberOfRows; i = i + 2) {
    unprotectedRanges.push(spreadsheet.getRange('B' + i + ':N' + i))
    unprotectedRanges.push(spreadsheet.getRange('P' + i))
  }
  protection.setUnprotectedRanges(unprotectedRanges)
};

function addUntilFiveFree () { // eslint-disable-line no-unused-vars
  var spreadsheet = SpreadsheetApp.getActive() // eslint-disable-line no-undef
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true)

  var numberOfRows = spreadsheet.getActiveSheet().getMaxRows()

  var freeRows = 0
  for (let i = 3; i < numberOfRows; i = i + 2) {
    if (spreadsheet.getRange('A' + i).isBlank()) {
      freeRows++
    }
  }
  for (let i = freeRows; i < 5; i++) {
    Addednewrow()
  }
}
