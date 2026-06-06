/**
 * GOOGLE APPS SCRIPT FOR LAGNA VASTRA APPOINTMENT FORM
 * 
 * Instructions to link your Google Sheet:
 * 1. Open your Google Sheet.
 * 2. Click on "Extensions" -> "Apps Script" in the top menu.
 * 3. Delete any code in the editor, and paste this entire script.
 * 4. Replace the spreadsheet ID (`docId`) with your Google Sheet's ID (found in its URL).
 * 5. Save the project (click the disk icon).
 * 6. Click "Deploy" -> "New deployment" (top right).
 * 7. Select type "Web app" (click the gear icon next to "Select type" if it's not selected).
 * 8. Set:
 *    - Description: Lagna Vastra Form Submission
 *    - Execute as: "Me (your-email@gmail.com)"
 *    - Who has access: "Anyone"  <-- CRITICAL: Must be "Anyone" so the website can submit data.
 * 9. Click "Deploy". You may need to authorize permissions.
 * 10. Copy the "Web app URL" provided (looks like https://script.google.com/macros/s/.../exec).
 * 11. Open `appointment-form.js` in your project code, find `const GOOGLE_SCRIPT_URL = '...';` around line 14,
 *     and replace that URL with your new Web App URL.
 */

function doPost(e) {
  try {
    // Paste your Google Sheet spreadsheet ID below:
    var docId = "1knz2bXZhWSWmzzUaXYHAhqrUp_fbi8XPgtVLtcvLlz8"; 
    var sheet;
    
    try {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    } catch (err) {
      sheet = SpreadsheetApp.openById(docId).getActiveSheet();
    }
    
    if (!sheet) {
      sheet = SpreadsheetApp.openById(docId).getActiveSheet();
    }
    
    var data = e.parameter;
    
    // Check if sheet is brand new/empty; if so, write the header row first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", 
        "Name", 
        "Phone", 
        "Email", 
        "Wedding Date", 
        "Outfit Type", 
        "Message"
      ]);
    }
    
    // Append the submission row matching the specified columns
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.date || "",
      data.ensemble || "",
      data.message || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
