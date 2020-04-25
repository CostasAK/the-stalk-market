/** @OnlyCurrentDoc */

function Resettonewweek() {
  var spreadsheet = SpreadsheetApp.getActive();
  
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true);
  number_of_rows = spreadsheet.getLastRow();
  
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Last Week'), true);
  spreadsheet.getRange('A3').activate();
  spreadsheet.getRange('Tracker!A3:P'+number_of_rows).copyTo(spreadsheet.getActiveRange(), SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  
  spreadsheet.setActiveSheet(spreadsheet.getSheetByName('Tracker'), true);
  var j;
  var previous_pattern;
  var current_pattern;
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