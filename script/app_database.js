var page = new $.futon.CouchDatabasePage();
$.futon.navigation.ready(function() {
  this.addDatabase(page.db.name);
  this.updateSelection(location.pathname, "?" + page.db.name);
});

$(function() {
  if (page.redirecting) return;
  $("h1 strong").text(page.db.name);
  var viewPath = page.viewName || "_all_docs";
  if (viewPath != "_temp_view" && viewPath != "_design_docs") {
    viewPath = $.map(viewPath.split("/"), function (part) {
      return encodeURIComponent(part);
    }).join("/");

    $("h1 a.raw").attr("href", "/" + encodeURIComponent(page.db.name) +
      "/" + viewPath);
  }

  $("#viewcode span").click(function() {
    $("#viewcode").toggleClass("collapsed");
  });
  $("#viewcode button.run").click(function() {
    page.updateDocumentListing();
  });
  $("#viewcode button.revert").click(function() {
    page.revertViewChanges();
  });
  $("#viewcode button.save").click(function() {
    page.saveViewChanges();
  });
  $("#viewcode button.saveas").click(function() {
    page.saveViewAs();
  });
  $("#viewcode textarea").makeResizable({
    always: true,
    grippie: $("#viewcode .bottom"),
    vertical: true
  });
  $("#viewcode td.map").makeResizable({
    always: true,
    grippie: $("#viewcode td.splitter"),
    horizontal: true
  });

  // Restore preferences/state
  $("#documents thead th.key").toggleClass("desc", !!$.futon.storage.get("desc"));
  var reduce = !!$.futon.storage.get("reduce");
  $("#reduce :checkbox")[0].checked = reduce;
  $("#grouplevel select").val(parseInt($.futon.storage.get("group_level")));
  $("#grouplevel").toggleClass("disabled", !reduce).find("select").each(function() {
    this.disabled = !reduce;
  });

  $("#perpage").val(parseInt($.futon.storage.get("per_page")));

  var staleViews = !!$.futon.storage.get("stale");
  $("#staleviews :checkbox")[0].checked = staleViews;

  page.populateViewsMenu();
  page.populateViewEditor();
  if (page.isTempView) {
    $("#viewcode").show().removeClass("collapsed").find("textarea")[0].focus();
    $("#documents").hide();
  }

  $("#switch select").change(function() {
    var viewName = $(this).val();
    if (!viewName) $.futon.storage.del("view");
    location.href = "?" + encodeURIComponent(page.db.name) +
      (viewName ? "/" + viewName  : "");
  });
  $("#staleviews :checkbox").click(function() {
    $.futon.storage.set("stale", this.checked);
  });
  $("#documents thead th.key span").click(function() {
    $(this).closest("th").toggleClass("desc");
    page.updateDocumentListing();
  });
  $("#grouplevel select").change(function() {
    page.updateDocumentListing();
    $.futon.storage.set("group_level", this.value);
  });
  $("#reduce :checkbox").click(function() {
    page.updateDocumentListing();
    var cb = this;
    $("#grouplevel").toggleClass("disabled", !cb.checked).find("select").each(function() {
      this.disabled = !cb.checked;
    });
    $.futon.storage.set("reduce", this.checked);
  });
  $("#perpage").change(function() {
    page.updateDocumentListing();
    $.futon.storage.set("per_page", this.value);
  });
  $("#toolbar button.add").click(page.newDocument);
  $("#toolbar button.compact").click(page.compactAndCleanup);
  $("#toolbar button.delete").click(page.deleteDatabase);
  $("#toolbar button.security").click(page.databaseSecurity);

  $('#jumpto input').suggest(function(text, callback) {
    page.db.allDocs({
      limit: 10, startkey: text, endkey: text + 'zzz',
      success: function(docs) {
        var matches = [];
        for (var i = 0; i < docs.rows.length; i++) {
          if (docs.rows[i].id.indexOf(text) == 0) {
            matches[i] = docs.rows[i].id;
          }
        }
        callback(matches);
      }
    });
  }).keypress(function(e) {
    if (e.keyCode == 13) {
      page.jumpToDocument($(this).val());
    }
  });
});