var page = new $.futon.CouchDocumentPage();

$.futon.navigation.ready(function() {
  this.addDatabase(page.db.name);
  this.updateSelection(
    location.pathname.replace(/document\.html/, "database.html"),
    "?" + page.db.name
  );
});

$(function() {
  $("h1 a.dbname").text(page.dbName)
    .attr("href", "database.html?" + encodeURIComponent(page.db.name));
  $("h1 strong").text(page.docId);
  $("h1 a.raw").attr("href", "/" + encodeURIComponent(page.db.name) +
    "/" + encodeURIComponent(page.docId));
  page.updateFieldListing();

  $("#tabs li.tabular a").click(page.activateTabularView);
  $("#tabs li.source a").click(page.activateSourceView);

  $("#toolbar button.save").click(page.saveDocument);
  $("#toolbar button.add").click(page.addField);
  $("#toolbar button.load").click(page.uploadAttachment);
  $("#toolbar button.copy").click(page.copyDocument);
  if (page.isNew) {
    $("#toolbar button.delete").hide();
  } else {
    $("#toolbar button.delete").click(page.deleteDocument);
  }
});