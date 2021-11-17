$('.install-plugin').each(function() {
  var button = $(this);
  var name = button.data('name');
  var version = button.data('version');
  $.get("/_config/plugins/" + name + "/", function(body, textStatus) {
    body = JSON.parse(body);
    if(body == version) {
      button.html('Already Installed. Click to Uninstall');
      button.data('delete', true);
    } else {
      button.html('Other Version Installed: ' + body);
      button.attr('disabled', true);
    }
  });
});

$('.install-plugin').click(function(event) {
  var button = $(this);
  var delete_plugin = button.data('delete') || false;
  var plugin_spec = JSON.stringify({
    name: button.data('name'),
    url: button.data('url'),
    version: button.data('version'),
    checksums: button.data('checksums'),
    "delete": delete_plugin
  });
  var url = '/_plugins'
  $.ajax({
    url: url,
    type: 'POST',
    data: plugin_spec,
    contentType: 'application/json', // what we send to the server
    dataType: 'json', // expected from the server
    processData: false, // keep our precious JSON
    success: function(data, textStatus, jqXhr) {
      if(textStatus == "success") {
        var action = delete_plugin ? 'Uninstalled' : 'Installed';
        button.html('Sucessfully ' + action);
        button.attr('disabled', true);
      } else {
        button.html(textStatus);
      }
    },
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Accept', 'application/json');
    },
  });
});