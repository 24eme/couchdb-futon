$(function() {
  updateTestsListing();
  $("#toolbar button.run").click(function() {
    setupAdminParty(runAllTests) ;
  });
  $("#toolbar button.load").click(function() {
    location.reload(true);
  });
  $("#toolbar button.share").click(function() {
    $.showDialog("dialog/_share_test_reports.html", {
      submit: function(data, callback) {
        $.couch.replicate("test_suite_reports", "http://couchdb.couchdb.org/test_suite_reports");
        callback();
      }
    });
  });
  $("#toolbar button.add").click(function() {
    location = "custom_test.html";
  });
});
var testsPath = document.location.toString().split('?')[1];
loadScript(testsPath||"script/couch_tests.js");
