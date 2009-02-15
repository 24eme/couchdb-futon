// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License.  You may obtain a copy
// of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
// License for the specific language governing permissions and limitations under
// the License.

couchTests.invalid_docids = function(debug) {
  var db = new CouchDB("test_suite_db");
  db.deleteDb();
  db.createDb();
  if (debug) debugger;

  // Test _local explicitly first.
  T(db.save({"_id": "_local/foo"}).ok);
  T(db.open("_local/foo")._id == "_local/foo");
  
  //Test non-string
  try {
    db.save({"_id": 1});
    T(1 == 0);
  } catch(e) {
      T(db.last_req.status == 400);
      T(e.error == "invalid_doc");
  }

  // Test invalid _prefix
  try {
    db.save({"_id": "_invalid"});
    T(1 == 0);
  } catch(e) {
      T(db.last_req.status == 400);
      T(e.error == "invalid_doc");
  }

  // Test _bulk_docs explicitly.
  var docs = [{"_id": "_design/foo"}, {"_id": "_local/bar"}];
  T(db.bulkSave(docs).ok);
  docs.forEach(function(d) {T(db.open(d._id)._id == d._id);});

  docs = [{"_id": "_invalid"}];
  try {
    db.bulkSave(docs);
    T(1 == 0);
  } catch(e) {
      T(db.last_req.status == 400);
      T(e.error == "invalid_doc");
  }
};
