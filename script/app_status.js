function toTaskDate(timestamp) {
  var d = new Date(timestamp * 1000);
  var hours = d.getHours(), min = d.getMinutes(), secs = d.getSeconds();
  var year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();

  return String(year) + "-" + (month < 10 ? "0" + month : month) + "-" +
    day + " " + (hours < 10 ? "0" + hours : hours) + ":" +
    (min < 10 ? "0" + min : min) + ":" + (secs < 10 ? "0" + secs : secs);
}
var refreshTimeout = null;

$.futon.storage.declare("poll_interval", {defaultValue: 5});

function refresh() {
  $.couch.activeTasks({
    success: function(tasks) {
      clearTimeout(refreshTimeout);
      $("#status tbody.content").empty();
      if (!tasks.length) {
        $("<tr class='none'><th colspan='6'>No tasks running</th></tr>")
          .appendTo("#status tbody.content");
      } else {
        $.each(tasks, function(idx, task) {
          var status, type, object;

          switch (task.type) {
          case "database_compaction":
            type = "Database compaction";
            object = task.database + (task.retry ? " retry" : "");
            status = "Copied " + task.changes_done + " of " +
              task.total_changes + " changes (" + task.progress + "%)";
            break;
          case "view_compaction":
            type = "View compaction";
            object = task.database + ", " + task.design_document;
            status = "Progress " + task.progress + "%";
            break;
          case "indexer":
            type = "Indexer";
            object = task.database + ", " + task.design_document;
            status = "Processed " + task.changes_done + " of " +
              task.total_changes + " changes (" + task.progress + "%)";
            break;
          case "replication":
            type = "Replication";
            object = task.source + " to " + task.target;
            status = "Checkpointed source sequence " +
              task.checkpointed_source_seq + ", current source sequence " +
              task.source_seq + ", progress " + task.progress + "%";
          }

          $("<tr><th></th><td class='object'></td><td class='started'>" +
            "</td><td class='updated'></td><td class='pid'></td>" +
            "<td class='status'></td></tr>")
            .find("th").text(type).end()
            .find("td.object").text(object).end()
            .find("td.started").text(toTaskDate(task.started_on)).end()
            .find("td.updated").text(toTaskDate(task.updated_on)).end()
            .find("td.pid").text(task.pid).end()
            .find("td.status").text(status).end()
            .appendTo("#status tbody.content");
        });
      }
      refreshTimeout = setTimeout(refresh,
        parseInt($("#interval input").val(), 10) * 1000);
    }
  });
}

function updateInterval(value) {
  if (isNaN(value)) {
    value = 5;
    $("#interval input").val(value);
  }
  $("#interval .secs").text(value);
  refresh();
  $.futon.storage.set("poll_interval", value);
}

$(function() {
  var slider = $("#interval input");
  slider.val(parseInt($.futon.storage.get("poll_interval")));
  if (slider[0].type == "range") {
    slider.bind("input", function() {
      updateInterval(this.value);
    });
    $("#interval .secs").text($("#interval input").val());
  } else {
    slider.bind("change", function() {
      updateInterval(this.value);
    });
    $("#interval .secs").hide();
  }
  refresh();
});