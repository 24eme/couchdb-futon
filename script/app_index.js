var page = new $.futon.CouchIndexPage();
$(document).ready(function() {
  if (!/index\.html$/.test(location.pathname)) {
    $.futon.navigation.ready(function() {
      this.updateSelection(location.pathname + "index.html");
    });
  }
  var dbsPerPage = parseInt($.futon.storage.get("per_page"));
  if (dbsPerPage) $("#perpage").val(dbsPerPage);
  $("#perpage").change(function() {
    page.updateDatabaseListing();
    $.futon.storage.set("per_page", this.value);
  });

  page.updateDatabaseListing();

  $("#toolbar button.add").click(function() {
    page.addDatabase();
  });
});