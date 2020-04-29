/** @OnlyCurrentDoc */

function Resettonewweek() {
  var spreadsheet = SpreadsheetApp.getActive();
  
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true);
  var number_of_rows = spreadsheet.getActiveSheet().getMaxRows();
  
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Last Week'), true);
  spreadsheet.getRange('A3').activate();
  spreadsheet.getRange('Tracker!A3:P'+number_of_rows).copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true);
  var j;
  var current_pattern;
  var previous_pattern;
  for (let i = 3; i < number_of_rows; i = i+2) {
    j = i+1;
    current_pattern = spreadsheet.getRange('P'+j).activate().getValue();
    switch (current_pattern) {
      case "Fluctuating":
      case "Fluctuating (100%)":
        previous_pattern = "Fluctuating";
        break;
      case "Large spike":
      case "Large spike (100%)":
        previous_pattern = "Large spike";
        break;
      case "Decreasing":
      case "Decreasing (100%)":
        previous_pattern = "Decreasing";
        break;
      case "Small spike":
      case "Small spike (100%)":
        previous_pattern = "Small spike";
        break;
      case "":
        previous_pattern = "";
        break;
      default:
        previous_pattern = "Unknown";
    }
    spreadsheet.getRange('P'+i).activate().setValue(previous_pattern);
    spreadsheet.getRange('B'+i+':N'+i).activate()
    .clear({contentsOnly: true, skipFilteredRows: true});
  }
};

function Addednewrow() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true);
  
  // Insert 2 new rows for 1 new contributor and determine max rows.
  spreadsheet.getActiveSheet().insertRowsAfter(spreadsheet.getActiveSheet().getMaxRows(), 2);
  var number_of_rows = spreadsheet.getActiveSheet().getMaxRows();
  var new_row = number_of_rows-1;
  
  // copy formatting (including data validation), formulas and conditional formatting from first row.
  spreadsheet.getRange('A3:P4').copyTo(spreadsheet.getRange('A'+new_row));
  spreadsheet.getRange('P'+new_row).activate()
  .clear({contentsOnly: true, skipFilteredRows: true});
  spreadsheet.getRange('B'+new_row+':N'+new_row).activate()
  .clear({contentsOnly: true, skipFilteredRows: true});
  spreadsheet.getRange('A'+new_row+':A'+number_of_rows).activate()
  .clear({contentsOnly: true, skipFilteredRows: true});
  
  // set interactable cells to unprotected
  var allProtections = spreadsheet.getActiveSheet().getProtections(SpreadsheetApp.ProtectionType.SHEET);
  var protection = allProtections[0];
  var unprotected_ranges = [spreadsheet.getRange('A3:A'+number_of_rows), spreadsheet.getRange('B3:N3'), spreadsheet.getRange('P3')];
  for (let i = 5; i < number_of_rows; i = i+2) {
    unprotected_ranges.push(spreadsheet.getRange('B'+i+':N'+i));
    unprotected_ranges.push(spreadsheet.getRange('P'+i));
  }
  protection.setUnprotectedRanges(unprotected_ranges);
};

function Adduntilfivefree() {
  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true);
  
  var number_of_rows = spreadsheet.getActiveSheet().getMaxRows();
  
  var free_rows = 0;
  for (let i = 3; i < number_of_rows; i = i+2) {
    if (spreadsheet.getRange('A'+i).isBlank()) {
      free_rows++;
    }
  }
  for (let i = free_rows; i < 5; i++) {
    Addednewrow();
  }
}