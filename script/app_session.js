$(function() {
  var ret, reason, q = window.location.search, qps = q.split("&");
  $.map(qps, function(qp) {
    var m = qp.match(/return=(.*)/);
    if (m) {
      ret = decodeURIComponent(m[1]);
    }
    m = qp.match(/reason=(.*)/);
    if (m) {
      reason = $.futon.escape(decodeURIComponent(m[1]));
    }
  });
  if (reason) {
    $("#aboutSession").append('<p>The application says: <em>'+reason+'</em></p>');
  }
  if (ret) {
    $("#aboutSession").append($('<p>Once you are logged in, click this link to return to your application: </p>').append($("<a></a>").attr("href", ret).text(ret)));
    // todo this needs to look different if you are already logged in
    // a note about you are logged in but you can't access this
  }
  // do the sidebar but in the middle without the sidebar
  $.futon.storage.set("sidebar", "hidden");
  setTimeout(function() {
    var ctx = $$("#userCtx").userCtx;
    $.futon.storage.set("sidebar", "show");
    if (ctx && ctx.name) {
      $("#aboutSession").append("<p>It looks like you are logged in, maybe you don't have access to that url.</p>");
    }
  },100);
});