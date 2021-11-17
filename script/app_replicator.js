$(document).ready(function() {
  var allDatabases;

  $("fieldset input[type=radio]").click(function() {
    var radio = this;
    var fieldset = $(this).parents("fieldset").get(0);
    $("input[type=text]", fieldset).each(function() {
      this.disabled = radio.value == "local";
      if (!this.disabled) this.focus();
    });
    $('.local', fieldset).each(function() {
      this.disabled = radio.value == "remote";
      if (!this.disabled) this.focus();
    });
  });

  var getDatabases = function() {
    $.couch.allDbs({
      success: function(dbs) {
        allDatabases = dbs.sort();

        $("fieldset select").each(function() {
          var select = this;
          $.each(dbs, function(idx, dbName) {
            $("<option></option>").text(dbName).appendTo(select);
          });
          select.selectedIndex = 0;
        });

        $('#to_name').autocomplete({ source: dbs });
      }
    });
  };
  getDatabases();

  $("button#swap").click(function() {
    var fromName = $("#source select").val();
    $("#source select").val($("#target select").val());
    $("#target select").val(fromName);

    var fromUrl = $("#source input[type=text]").val();
    $("#source input[type=text]").val($("#target input[type=text]").val());
    $("#target input[type=text]").val(fromUrl);

    var fromType = $("#source input[type=radio]").filter(function() {
      return this.checked;
    }).val();
    var toType = $("#target input[type=radio]").filter(function() {
      return this.checked;
    }).val();
    $("#source input[value=" + toType + "]").click();
    $("#target input[value=" + fromType + "]").click();

    $("#replicate").get(0).focus();
    return false;
  });

  $("button#replicate").click(function() {
    $("#records tbody.content").empty();
    var targetIsLocal = $('#to_local:checked').length > 0;
    var source = $("#from_local")[0].checked ? $("#from_name").val() : $("#from_url").val();
    var target = targetIsLocal ? $("#to_name").val() : $("#to_url").val();
    var repOpts = {};

    if (targetIsLocal && $.inArray(target, allDatabases) < 0) {
      if(!confirm('This will create a database named '+target+'. Ok?')) {
        return;
      }
      else {
        repOpts.create_target = true;
      }
    }

    if ($("#continuous")[0].checked) {
      repOpts.continuous = true;
    }

    if ($("#doc_ids").val()){
      try {
         var doc_ids = JSON.parse($("#doc_ids").val());
         if ($.isArray(doc_ids)) {
            repOpts.doc_ids = doc_ids;
         } else {
            $("#records tbody.footer td")
              .text('Invalid format! Should be: ["doc1", "doc2", ...]'); 
            return false;
         }
      } catch (e) {
         $("#records tbody.footer td")
           .text('Invalid format! Should be: ["doc1", "doc2", ...]');
         return false;
      }
    }
    $.couch.replicate(source, target, {
      success: function(resp) {
        if ( resp.history == null || resp._local_id) {
          $("<tr><th></th></tr>")
            .find("th").text(JSON.stringify(resp)).end()
            .appendTo("#records tbody.content");
          $("#records tbody tr").removeClass("odd").filter(":odd").addClass("odd");
          $("#records tbody.footer td")
            .text((resp._local_id)? "Continuous replication" :
                                    "Named document replication");
        } else {
          $.each(resp.history, function(idx, record) {
            $("<tr><th></th></tr>")
              .find("th").text(JSON.stringify(record)).end()
              .appendTo("#records tbody.content");
          });
          $("#records tbody tr").removeClass("odd").filter(":odd").addClass("odd");
          $("#records tbody.footer td").text("Replication session " + resp.session_id);

          if (repOpts.create_target) {
            getDatabases();
          }
        }
      }
    }, repOpts);
  });
});
