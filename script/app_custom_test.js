function T(arg, desc) {
  if(!arg) {
    mesg = "Assertion failed" + (desc ? ": " + desc : "");
    throw new Error(mesg);
  }
}

function TEquals(expect, found, descr) {
  var mesg = "expected '" + expect + "', got '" + found + "' " + descr;
  T(expect === found, mesg);
}

$.futon.navigation.ready(function() {
  this.updateSelection(
    location.pathname.replace(/custom_test\.html/, "couch_tests.html"),
      "?script/couch_tests.js");
});

$(function() {
  $("#status").removeClass("failure").removeClass("success");
  $("#viewcode textarea").enableTabInsertion().makeResizable({
    always: true,
    grippie: $("#viewcode .bottom"),
    vertical: true
  });
  $("#viewcode button.run").click(function() {
    $("#status").removeClass("failure").removeClass("success");
    var code = $("#code").val();
    try {
      var couchTests = {};
      var debug = false;
      code = eval(code);
      $.each(couchTests, function(elm) {
        couchTests[elm](debug);
      });
    } catch(e) {
      alert("" + e);
      $("#status").text("failure").addClass("failure");
      return false;
    }
    $("#status").text("success").addClass("success");
    return false;
  });
});
