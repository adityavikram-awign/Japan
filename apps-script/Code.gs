/**
 * Awign Japan — sign-up form → Google Sheet.
 *
 * Setup (once):
 *  1. Create a Google Sheet. Extensions → Apps Script. Replace Code.gs with this file. Save.
 *  2. Deploy → New deployment → type "Web app".
 *     Execute as: Me.  Who has access: Anyone.  Deploy, allow access.
 *  3. Copy the Web app URL (ends in /exec) into CONFIG.FORM_ENDPOINT in i18n.js.
 *  After editing this script: Deploy → Manage deployments → edit → Version: New version
 *  (keeps the same URL).
 */

var SHEET_NAME = "Registrations";

var COLUMNS = [
  ["timestamp_jst", "Submitted (JST)"],
  ["name", "Name"],
  ["kana", "Kana"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["prefecture", "Prefecture"],
  ["device", "Smartphone"],
  ["headmount", "Head mount"],
  ["eligible", "Eligible phone"],
  ["duplicate", "Duplicate of row"],
  ["agree_terms", "Agreed terms"],
  ["agree_privacy", "Agreed privacy + overseas"],
  ["age_18", "18+"],
  ["consent_version", "Consent version"],
  ["lang", "Language"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["utm_term", "utm_term"],
  ["fbclid", "fbclid"],
  ["referrer", "Referrer"],
  ["page", "Page"],
  ["user_agent", "User agent"],
  ["status", "Status (team)"],
  ["notes", "Notes (team)"],
];

var DEVICE_LABELS = {
  iphone12: "iPhone 12+",
  android: "Android (Pixel 6+ / Galaxy S21+)",
  iphone_old: "iPhone 11 or older",
  none: "None",
};
var MOUNT_LABELS = { have: "Has one", not_yet: "Not yet" };

function doGet() {
  return json_({ ok: true, service: "awign-japan-signup" });
}

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Bots fill the hidden "website" field; pretend success and drop it.
    if (d.website) return json_({ ok: true });

    var err = validate_(d);
    if (err) return json_({ ok: false, error: err });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sh = sheet_();
      var emailCol = colIndex_("email");
      var dup = "";
      var last = sh.getLastRow();
      if (last > 1) {
        var emails = sh.getRange(2, emailCol, last - 1, 1).getValues();
        for (var i = 0; i < emails.length; i++) {
          if (String(emails[i][0]).toLowerCase() === d.email) { dup = String(i + 2); break; }
        }
      }

      var row = {
        timestamp_jst: Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd HH:mm:ss"),
        device: DEVICE_LABELS[d.device] || d.device,
        headmount: MOUNT_LABELS[d.headmount] || d.headmount,
        eligible: d.device === "iphone12" || d.device === "android" ? "Yes" : "No",
        duplicate: dup,
        agree_terms: d.agree_terms ? "Yes" : "No",
        agree_privacy: d.agree_privacy ? "Yes" : "No",
        age_18: d.age_18 ? "Yes" : "No",
        status: "New",
      };
      var values = COLUMNS.map(function (c) {
        var v = row[c[0]] !== undefined ? row[c[0]] : d[c[0]];
        return clean_(v);
      });
      var r = sh.getLastRow() + 1;
      // Plain text so phone numbers keep their leading 0.
      sh.getRange(r, 1, 1, values.length).setNumberFormat("@").setValues([values]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (x) {
    return json_({ ok: false, error: "server" });
  }
}

function validate_(d) {
  d.email = String(d.email || "").trim().toLowerCase();
  d.phone = String(d.phone || "").replace(/\D/g, "");
  if (String(d.name || "").trim().length < 2) return "name";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return "email";
  if (!/^0\d{9,10}$/.test(d.phone)) return "phone";
  if (!d.prefecture) return "prefecture";
  if (!DEVICE_LABELS[d.device]) return "device";
  if (!MOUNT_LABELS[d.headmount]) return "headmount";
  if (!(d.agree_terms && d.agree_privacy && d.age_18)) return "consent";
  return "";
}

// Stop values being read as spreadsheet formulas, and cap length.
function clean_(v) {
  var s = v === undefined || v === null ? "" : String(v);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s.slice(0, 500);
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNS.map(function (c) { return c[1]; }));
    sh.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold").setBackground("#e8eefc");
    sh.setFrozenRows(1);
  }
  return sh;
}

function colIndex_(key) {
  for (var i = 0; i < COLUMNS.length; i++) if (COLUMNS[i][0] === key) return i + 1;
  return -1;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
