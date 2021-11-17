$(function($) {
  $("#result").html("");
  $("#run").click(verify_install);
});

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

function tests() {
  CouchDB.urlPrefix = "..";
  var db = new CouchDB("test_suite_db", {"X-Couch-Full-Commit":"false"});

  // cleanup, ignore the 404
  try {db.deleteDb();} catch(e) {};
  // create db
  db.createDb();

  // create document
  var doc = {a:1};
  var resp = db.save(doc);
  TEquals(true, resp.ok, "save document");
  // update document
  doc.b = 2;
  resp = db.save(doc);
  TEquals(true, resp.ok, "update document");
  TEquals(2, doc.b, "update document verified");
  // delete document
  resp = db.deleteDoc(doc);
  TEquals(true, resp.ok, "delete document");
  var doc2 = db.open(doc.id);
  TEquals(doc2, null, "delete document verified");

  // excercise query server
  db.save({a:1});
  db.save({a:2});
  db.save({a:3});

  //  temporary view
  var resp = db.query(function(doc) {
    if(doc.a) {
      emit(doc.a, doc.a);
    }
  });
  TEquals(3, resp.total_rows, "temp view query");

  // replication
  //   create second db
  var db2 = new CouchDB("test_suite_db2", {"X-Couch-Full-Commit":"false"});
  try {db2.deleteDb();} catch (e) {};
  db2.createDb();
  //   do replicate
  CouchDB.replicate("test_suite_db", "test_suite_db2");
  //   compare results
  TEquals(db.info().doc_count, db2.info().doc_count, "databases are equal");
}

function verify_install() {
  try {
    var result = $("#result");
    result.html("Running…");
    tests();
    result.html("Your installation looks fine. Time to Relax.");
  } catch(e) {
    console.log(e);
    result.html("X: " + e);
  }
}
