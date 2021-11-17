$(function() {
  $.couch.config({
    success: function(resp) {
      var sections = [];
      for (var sectionName in resp) {
        sections.push(sectionName);
      }
      sections.sort();
      $.each(sections, function(idx, sectionName) {
        var row = $("<tr><th></th></tr>")
          .find("th").text(sectionName).end()
          .appendTo("#config tbody.content");
        var section = resp[sectionName]
        var options = [];
        for (var option in section) {
          options.push(option);
        }
        options = options.sort();
        var prev = null;
        $.each(options, function(idx, optionName) {
          var cur = idx == 0 ? row : $("<tr></tr>");
          $("<td class='name' section="+sectionName+"><b></b></td>")
            .find("b").text(optionName).end().appendTo(cur);
          $("<td class='value'><code></code></td>")
            .find("code").text(section[optionName]).end().appendTo(cur);
          cur.data("section", sectionName).data("option", optionName);
          if (cur !== row) cur.insertAfter(prev);
          prev = cur;
        });
        row.find("th").attr("rowspan", options.length);
      });
      $("#config tbody tr").removeClass("odd").filter(":odd").addClass("odd");
      $("#config tbody td.value code").makeEditable({
        accept: function(newValue) {
          var row = $(this).parents("tr").eq(0);
          $.couch.config({
            success: function(resp) {
              row.find("td.value code").text(newValue);
          }}, row.data("section"), row.data("option"), newValue);
        }
      }).parent().parent()
        .append($('<td><div style="text-align:center;""><a class="remove" href="#remove">x</a></div></td>'))
        .click(function (ev) {
          // There is a listener that stops all events below this element which is
          // why the remove link listener has to be here
          var n = $(ev.target).parent().parent().parent();
          if ($(ev.target).attr('href') === "#remove" ) {
            $.couch.config({ success: function () {location = location.href.split('#')[0];} }
                           , n.find('td.name').attr("section"), n.find('td.name').text(), null);
          }
      })
      var add = $('<a href="#add">Add a new section</a>').click(function () {
        $.showDialog("dialog/_create_config.html", {
          submit: function(data, callback) {
            var fail = false;
            if (!data.section || data.section.length == 0) {
              callback({section: "Please enter a section."});
              fail = true;
            }
            if (!data.option || data.option.length == 0) {
              callback({option: "Please enter a option."});
              fail = true;
            }
            if (!data.val || data.val.length == 0) {
              callback({val: "Please enter a value."});
              fail = true;
            }
            if (fail) {return}
            $.couch.config({ success: function () {callback();location = location.href.split('#')[0]} }
                           , data.section, data.option, data.val);
          }
        });
      })
      $("div#content").append(add)
    }
  });

});
